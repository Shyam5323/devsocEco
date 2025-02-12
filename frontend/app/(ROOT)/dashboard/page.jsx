import NavbarLI from "@/components/NavbarLogedIn";
import styles from "./abc.module.css";
import { cookies } from "next/headers";
import { redirect} from "next/navigation";

async function Home() {
  // Sample data to populate the values dynamically (this could come from an API or state)
  const cookiestore = await cookies();
  const token = cookiestore.get('auth_token');
  console.log(token);
  if(!token){
    redirect('/login');
  }
  const streakDays = 15;
  const recommendations = ["Recommendation 1", "Recommendation 2", "Recommendation 3"];
  const carbonFootprint = 10; // in kg CO2e
  const co2SavedToday = 3; // in kg CO2e
  const dailyReports = ["Report 1", "Report 2", "Report 3"];

  return (
    <div className="relative max-w-full">
      <NavbarLI />

      {/* Streak, Carbon Footprint, and CO2 Saved Today Sections */}
      <div className={styles.container}>
        <div className={styles.con1}>
          <div className={styles.box1}>
            <h3 className={styles.header}>Streak</h3>
            <p>{streakDays} DAYS</p>
          </div>
        </div>
        <div className={styles.con1}>
          <div className={styles.box1}>
            <h3 className={styles.header}>Carbon Footprints Generated</h3>
            <p>{carbonFootprint} kg CO2e</p>
          </div>
        </div>
        <div className={styles.con1}>
          <div className={styles.box1}>
            <h3 className={styles.header}>
              Today you saved {co2SavedToday} kg CO2e
            </h3>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Recommendations Section */}
        <div className={styles.con2}>
          <div className={styles.box3}>
            <h3 className={styles.header}>Top 3 recommendations</h3>
            <ul className={styles.recommendationsList}>
              {recommendations.map((recommendation, index) => (
                <li key={index} className={styles.recommendationItem}>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Daily Reports Section */}
        <div className={styles.con2}>
          <div className={styles.box3}>
            <h3 className={styles.header}>Daily Reports</h3>
            <ul className={styles.reportsList}>
              {dailyReports.map((report, index) => (
                <li key={index} className={styles.reportItem}>
                  {report}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; // ✅ Protect the Home page with authentication
