from integrations.email_client import EmailClient


def test_email_client_stubs():
    client = EmailClient()
    assert client.fetch_unread() == []
    assert client.send_email("a@example.com", "subj", "body") is False


