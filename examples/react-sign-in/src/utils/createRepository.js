function createRepository() {
  return {
    signIn: () =>
      Promise.resolve({
        name: 'Matheus',
        email: 'teste@teste.com',
        avatar: 'https://example.com',
        accessToken: 'token',
        ttl: 1234,
      }),
  };
}

export default createRepository;
