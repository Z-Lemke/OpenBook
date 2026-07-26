import copy
import json
import unittest
from pathlib import Path

from jsonschema import Draft202012Validator

from openbook.course_artifact import (
    CourseArtifactValidationError,
    validate_course_artifact,
    validate_fixture_bundle,
)


FIXTURE_DIRECTORY = Path(__file__).parent / "fixtures" / "course_artifact" / "v1"
SCHEMA_PATH = Path(__file__).parents[1] / "schemas" / "course-artifact" / "v1.schema.json"


def load_json(name):
    with (FIXTURE_DIRECTORY / name).open(encoding="utf-8") as fixture_file:
        return json.load(fixture_file)


class CourseArtifactContractTests(unittest.TestCase):
    def setUp(self):
        self.artifact = load_json("course.json")
        self.commands = load_json("commands.json")

    def assert_invalid_artifact(self, artifact):
        with self.assertRaises(CourseArtifactValidationError):
            validate_course_artifact(artifact)

    def assert_invalid_bundle(self, artifact, commands):
        with self.assertRaises(CourseArtifactValidationError):
            validate_fixture_bundle(artifact, commands)

    def test_v1_fixture_passes_schema_and_lineage_validation(self):
        artifact_before_validation = copy.deepcopy(self.artifact)
        commands_before_validation = copy.deepcopy(self.commands)
        self.assertIsNone(validate_course_artifact(self.artifact))
        self.assertIsNone(validate_fixture_bundle(self.artifact, self.commands))
        self.assertEqual(artifact_before_validation, self.artifact)
        self.assertEqual(commands_before_validation, self.commands)

    def test_versioned_json_schema_describes_the_public_contract(self):
        with SCHEMA_PATH.open(encoding="utf-8") as schema_file:
            schema = json.load(schema_file)

        Draft202012Validator.check_schema(schema)
        self.assertEqual("OpenBook Course Artifact v1", schema["title"])
        self.assertEqual(
            "course-artifact/v1", schema["properties"]["schemaVersion"]["const"]
        )
        self.assertFalse(schema["additionalProperties"])
        self.assertIn("htmlPageSpec", schema["$defs"])
        self.assertFalse(list(Draft202012Validator(schema).iter_errors(self.artifact)))

    def test_json_schema_rejects_root_predecessor_and_wrong_page_kind(self):
        with SCHEMA_PATH.open(encoding="utf-8") as schema_file:
            schema = json.load(schema_file)
        validator = Draft202012Validator(schema)

        root_with_predecessor = copy.deepcopy(self.artifact)
        root_with_predecessor["predecessorArtifactId"] = "older-artifact"
        self.assertTrue(list(validator.iter_errors(root_with_predecessor)))

        wrong_page_kind = copy.deepcopy(self.artifact)
        wrong_page_kind["coursePage"]["kind"] = "lesson"
        self.assertTrue(list(validator.iter_errors(wrong_page_kind)))

    def test_fixture_contains_the_i01_contract_evidence(self):
        self.assertEqual("course-artifact/v1", self.artifact["schemaVersion"])
        self.assertEqual(1, self.artifact["revision"])
        self.assertIsNone(self.artifact["predecessorArtifactId"])
        self.assertTrue(self.artifact["learner"]["goal"])
        self.assertGreater(self.artifact["learner"]["availableMinutesPerDay"], 0)

        lessons = self.artifact["lessons"]
        self.assertGreaterEqual(len(lessons), 1)
        self.assertEqual(
            list(range(1, len(lessons) + 1)),
            [lesson["order"] for lesson in lessons],
        )
        self.assertEqual(len(lessons), len({lesson["lessonId"] for lesson in lessons}))

        self.assertTrue(self.artifact["coursePage"]["blocks"])
        self.assertTrue(self.artifact["readAheadPage"]["blocks"])
        self.assertTrue(self.artifact["dailyPage"]["blocks"])
        self.assertGreaterEqual(len(self.artifact["sourceCandidates"]), 1)
        self.assertGreaterEqual(len(self.artifact["sourceUses"]), 1)
        self.assertGreaterEqual(len(self.artifact["sourceGaps"]), 1)

        command_types = {command["type"] for command in self.commands}
        self.assertEqual({"recordWork", "recordFeedback"}, command_types)

    def test_source_use_must_reference_a_candidate_source(self):
        artifact = copy.deepcopy(self.artifact)
        artifact["sourceUses"][0]["sourceId"] = "source-does-not-exist"

        self.assert_invalid_artifact(artifact)

    def test_source_gap_requires_a_lesson_and_an_explicit_need(self):
        artifact = copy.deepcopy(self.artifact)
        del artifact["sourceGaps"][0]["need"]

        self.assert_invalid_artifact(artifact)

    def test_source_candidate_requires_permitted_use_and_retrieval_context(self):
        artifact = copy.deepcopy(self.artifact)
        del artifact["sourceCandidates"][0]["permittedUse"]

        self.assert_invalid_artifact(artifact)

    def test_lesson_page_must_remain_declarative(self):
        artifact = copy.deepcopy(self.artifact)
        artifact["lessons"][0]["page"]["blocks"][0]["script"] = "alert('not allowed')"

        self.assert_invalid_artifact(artifact)

    def test_non_root_revision_requires_a_predecessor_artifact_id(self):
        artifact = copy.deepcopy(self.artifact)
        artifact["revision"] = 2
        artifact["predecessorArtifactId"] = None

        self.assert_invalid_artifact(artifact)

    def test_lineage_validator_requires_contiguous_lesson_order(self):
        artifact = copy.deepcopy(self.artifact)
        artifact["lessons"][0]["order"] = 2

        self.assert_invalid_artifact(artifact)

    def test_command_must_reference_the_fixture_artifact(self):
        commands = copy.deepcopy(self.commands)
        commands[0]["artifactId"] = "artifact-does-not-exist"

        self.assert_invalid_bundle(self.artifact, commands)

    def test_command_requires_a_learner_identity_for_future_attribution(self):
        commands = copy.deepcopy(self.commands)
        del commands[0]["learnerId"]

        self.assert_invalid_bundle(self.artifact, commands)

    def test_command_must_reference_a_lesson_in_the_artifact(self):
        commands = copy.deepcopy(self.commands)
        commands[0]["lessonId"] = "lesson-does-not-exist"

        self.assert_invalid_bundle(self.artifact, commands)


if __name__ == "__main__":
    unittest.main()
