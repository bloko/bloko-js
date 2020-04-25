import React from 'react';
import Auth from './modules/Auth';

function App() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setResult('');

    const input = {
      email,
      password,
    };

    try {
    const response = await Auth.signIn(input);
    setResult(response);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <form noValidate onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
      <input value={email} placeholder="Email" type="email" onChange={e => setEmail(e.target.value)} />
      <input value={password} placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">
        Submit
      </button>
      </form>
      {result && (<pre>
        <code>
          {JSON.stringify(result, null, 2)}
        </code>
      </pre>)}
      {error && (<pre>
        <code>
          {JSON.stringify(error, null, 2)}
        </code>
      </pre>)}
    </div>
  );
}

export default App;
