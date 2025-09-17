from core.speech_to_text import SpeechToText


def test_transcribe_stub():
    stt = SpeechToText()
    assert stt.transcribe("data/audio/sample.wav") is None


