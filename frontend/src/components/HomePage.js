import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div>
      <header>
        <h1>Bienvenue sur la plateforme médicale</h1>
        <nav>
          <a href="#login">Connexion</a>
          <a href="#signup">Inscription</a>
        </nav>
      </header>

      <main>
        <section id="login" className="card">
          <h2>Connexion</h2>
          <form>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" required />

            <button type="submit">Se connecter</button>
          </form>
        </section>

        <section id="signup" className="card">
          <h2>Inscription</h2>
          <form>
            <label htmlFor="new-email">Email</label>
            <input type="email" id="new-email" name="new-email" required />

            <label htmlFor="new-password">Mot de passe</label>
            <input type="password" id="new-password" name="new-password" required />

            <button type="submit">S'inscrire</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
