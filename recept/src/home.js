import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div>
      <h1>Välkommen!</h1>
      <a href="http://localhost:3000/auth/github">Logga in med GitHub</a>
      <br />
      <Link to="/home">
        <button>Fortsätt utan att logga in</button>
      </Link>
    </div>
  );
}

export default Welcome;