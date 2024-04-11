import * as React from "react";
import WelcomeBanner from "../../partials/dashboard/WelcomeBanner";
import BarChart01 from "../../charts/BarChart01";

const DashboardHomePage = () => {
  return (
    <>
      <WelcomeBanner />
      <div className="w-full mt-2">
        <BarChart01 />
      </div>
    </>
  );
};

export { DashboardHomePage };
