"""Validation for the immutable, declarative Course Artifact v1 contract."""


class CourseArtifactValidationError(ValueError):
    """Raised when a Course Artifact or command fixture breaks the public contract."""


def _fail(path, message):
    raise CourseArtifactValidationError(f"{path}: {message}")


def _require_dict(value, path, keys):
    if not isinstance(value, dict):
        _fail(path, "must be an object")
    if set(value) != set(keys):
        _fail(path, f"must contain exactly: {', '.join(sorted(keys))}")
    return value


def _require_list(value, path, *, nonempty=False):
    if not isinstance(value, list):
        _fail(path, "must be an array")
    if nonempty and not value:
        _fail(path, "must not be empty")
    return value


def _require_string(value, path):
    if not isinstance(value, str) or not value.strip():
        _fail(path, "must be a non-blank string")
    return value


def _require_positive_int(value, path):
    if isinstance(value, bool) or not isinstance(value, int) or value <= 0:
        _fail(path, "must be a positive integer")
    return value


def _unique_id(value, path, seen):
    value = _require_string(value, path)
    if value in seen:
        _fail(path, f"duplicates {value!r}")
    seen.add(value)
    return value


def _validate_page(page, path, expected_kind, lesson_ids, page_ids):
    _require_dict(page, path, {"pageId", "kind", "title", "blocks"})
    _unique_id(page["pageId"], f"{path}.pageId", page_ids)
    if page["kind"] != expected_kind:
        _fail(f"{path}.kind", f"must be {expected_kind!r}")
    _require_string(page["title"], f"{path}.title")
    blocks = _require_list(page["blocks"], f"{path}.blocks", nonempty=True)
    block_ids = set()
    for index, block in enumerate(blocks):
        block_path = f"{path}.blocks[{index}]"
        if not isinstance(block, dict):
            _fail(block_path, "must be an object")
        block_type = block.get("type")
        if block_type in {"text", "prompt"}:
            _require_dict(block, block_path, {"blockId", "type", "text"})
        elif block_type == "lesson-link":
            _require_dict(block, block_path, {"blockId", "type", "lessonId", "text"})
            if block["lessonId"] not in lesson_ids:
                _fail(f"{block_path}.lessonId", "must reference a lesson in this artifact")
        else:
            _fail(f"{block_path}.type", "must be text, prompt, or lesson-link")
        _unique_id(block["blockId"], f"{block_path}.blockId", block_ids)
        _require_string(block["text"], f"{block_path}.text")


def validate_course_artifact(artifact):
    """Validate one immutable `course-artifact/v1` submission without mutating it."""
    _require_dict(
        artifact,
        "artifact",
        {
            "schemaVersion",
            "artifactId",
            "revision",
            "predecessorArtifactId",
            "learner",
            "title",
            "lessons",
            "coursePage",
            "readAheadPage",
            "dailyPage",
            "sourceCandidates",
            "sourceUses",
            "sourceGaps",
        },
    )
    if artifact["schemaVersion"] != "course-artifact/v1":
        _fail("artifact.schemaVersion", "must be 'course-artifact/v1'")
    _require_string(artifact["artifactId"], "artifact.artifactId")
    revision = _require_positive_int(artifact["revision"], "artifact.revision")
    predecessor = artifact["predecessorArtifactId"]
    if revision == 1 and predecessor is not None:
        _fail("artifact.predecessorArtifactId", "must be null for revision 1")
    if revision > 1:
        _require_string(predecessor, "artifact.predecessorArtifactId")
    _require_string(artifact["title"], "artifact.title")

    learner = _require_dict(
        artifact["learner"], "artifact.learner", {"goal", "availableMinutesPerDay"}
    )
    _require_string(learner["goal"], "artifact.learner.goal")
    _require_positive_int(
        learner["availableMinutesPerDay"], "artifact.learner.availableMinutesPerDay"
    )

    lessons = _require_list(artifact["lessons"], "artifact.lessons", nonempty=True)
    lesson_ids = set()
    for index, lesson in enumerate(lessons):
        path = f"artifact.lessons[{index}]"
        _require_dict(lesson, path, {"lessonId", "order", "title", "page"})
        _unique_id(lesson["lessonId"], f"{path}.lessonId", lesson_ids)
        if lesson["order"] != index + 1:
            _fail(f"{path}.order", "must be contiguous and start at 1")
        _require_string(lesson["title"], f"{path}.title")

    page_ids = set()
    _validate_page(artifact["coursePage"], "artifact.coursePage", "course", lesson_ids, page_ids)
    _validate_page(
        artifact["readAheadPage"],
        "artifact.readAheadPage",
        "read-ahead",
        lesson_ids,
        page_ids,
    )
    _validate_page(artifact["dailyPage"], "artifact.dailyPage", "daily", lesson_ids, page_ids)
    for index, lesson in enumerate(lessons):
        _validate_page(
            lesson["page"],
            f"artifact.lessons[{index}].page",
            "lesson",
            lesson_ids,
            page_ids,
        )

    source_ids = set()
    for index, candidate in enumerate(
        _require_list(artifact["sourceCandidates"], "artifact.sourceCandidates", nonempty=True)
    ):
        path = f"artifact.sourceCandidates[{index}]"
        _require_dict(
            candidate,
            path,
            {
                "sourceId",
                "title",
                "url",
                "coverage",
                "provenance",
                "permittedUse",
                "retrievalContext",
            },
        )
        _unique_id(candidate["sourceId"], f"{path}.sourceId", source_ids)
        for field in (
            "title",
            "url",
            "coverage",
            "provenance",
            "permittedUse",
            "retrievalContext",
        ):
            _require_string(candidate[field], f"{path}.{field}")

    use_ids = set()
    for index, source_use in enumerate(
        _require_list(artifact["sourceUses"], "artifact.sourceUses", nonempty=True)
    ):
        path = f"artifact.sourceUses[{index}]"
        _require_dict(source_use, path, {"useId", "sourceId", "lessonId", "role", "coveredClaim"})
        _unique_id(source_use["useId"], f"{path}.useId", use_ids)
        if source_use["sourceId"] not in source_ids:
            _fail(f"{path}.sourceId", "must reference a source candidate")
        if source_use["lessonId"] not in lesson_ids:
            _fail(f"{path}.lessonId", "must reference a lesson")
        _require_string(source_use["role"], f"{path}.role")
        _require_string(source_use["coveredClaim"], f"{path}.coveredClaim")

    gap_ids = set()
    for index, gap in enumerate(_require_list(artifact["sourceGaps"], "artifact.sourceGaps")):
        path = f"artifact.sourceGaps[{index}]"
        _require_dict(gap, path, {"gapId", "lessonId", "need"})
        _unique_id(gap["gapId"], f"{path}.gapId", gap_ids)
        if gap["lessonId"] not in lesson_ids:
            _fail(f"{path}.lessonId", "must reference a lesson")
        _require_string(gap["need"], f"{path}.need")


def validate_fixture_bundle(artifact, commands):
    """Validate Course Artifact v1 commands against their artifact and lesson lineage."""
    validate_course_artifact(artifact)
    commands = _require_list(commands, "commands", nonempty=True)
    lesson_ids = {lesson["lessonId"] for lesson in artifact["lessons"]}
    command_ids = set()
    for index, command in enumerate(commands):
        path = f"commands[{index}]"
        if not isinstance(command, dict):
            _fail(path, "must be an object")
        command_type = command.get("type")
        base_keys = {
            "commandVersion",
            "commandId",
            "type",
            "learnerId",
            "artifactId",
            "lessonId",
        }
        if command_type == "recordWork":
            _require_dict(command, path, base_keys | {"outcome"})
        elif command_type == "recordFeedback":
            _require_dict(command, path, base_keys | {"rating", "comment"})
        else:
            _fail(f"{path}.type", "must be recordWork or recordFeedback")
        if command["commandVersion"] != "learning-command/v1":
            _fail(f"{path}.commandVersion", "must be 'learning-command/v1'")
        _unique_id(command["commandId"], f"{path}.commandId", command_ids)
        _require_string(command["learnerId"], f"{path}.learnerId")
        if command["artifactId"] != artifact["artifactId"]:
            _fail(f"{path}.artifactId", "must reference this artifact")
        if command["lessonId"] not in lesson_ids:
            _fail(f"{path}.lessonId", "must reference a lesson in this artifact")
        if command_type == "recordWork":
            _require_string(command["outcome"], f"{path}.outcome")
        else:
            _require_string(command["rating"], f"{path}.rating")
            _require_string(command["comment"], f"{path}.comment")
