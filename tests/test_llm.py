from core.llm_engine import LLMEngine


def test_generate_stub():
    llm = LLMEngine()
    resp = llm.generate("Say hi")
    assert isinstance(resp, str)
    assert "placeholder" in resp.lower()


