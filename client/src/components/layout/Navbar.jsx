import styles from "./navbar.module.scss";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <h1 onClick={() => navigate("/")}>IBL Finserv</h1>
      </div>

      <div className={styles.right}>
        <button>Join Today</button>
      </div>
    </nav>
  );
};

export default Navbar;
