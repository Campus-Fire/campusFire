import http from 'k6/http';

export default function () {
  const url = 'http://52.42.111.64:4001/graphql';

  const mutation = `mutation Login {
    login (input: { email: "test-k6@example.com", password: "test"}) {
      id
      email
      isVerified
      createdAt
      expiresAt
      lastLogin
      token
    }
  }`;

  const headers = {
    'Content-Type': 'application/json',
  };

  for (let i = 0; i < 100; i++) {
    const res = http.post(
      url,
      JSON.stringify({
        query: mutation,
      }),
      { headers: headers }
    );

    if (res.status == 200) {
      console.log(res.body);
    }
  }
}
