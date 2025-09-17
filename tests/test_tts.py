from core.text_to_speech import TextToSpeech


def test_synthesize_stub(tmp_path):
    tts = TextToSpeech()
    out = tmp_path / "out.wav"
    assert tts.synthesize("hello", out) is None


