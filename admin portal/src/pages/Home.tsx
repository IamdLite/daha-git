//import React from 'react';
import TopDealsBox from '../components/topCoursesBox/TopCoursesBox';
import ChartBox from '../components/charts/ChartBox';
import {
  MdGroup,
  MdInventory2,
  MdAssessment,
  MdSwapHorizontalCircle,
} from 'react-icons/md';

import totalCourses from '../data/totalCourses';
import botUsers from '../data/botUsers';
import totalClicks from '../data/totalClicks';
import dailyBotUsage from '../data/dailyBotUsage';
import visitsBySource from '../data/visitsBySource';
import totalSource from '../data/totalSource';
import totalUsers from '../data/totalUsers';
import totalVisit from '../data/totalVisit';


const Home = () => {
  return (
    <div className="home w-full p-0 m-0">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 grid-flow-dense auto-rows-[minmax(200px,auto)] xl:auto-rows-[minmax(150px,auto)] gap-3 xl:gap-3 px-0">
        {/* Top Deals Box */}
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 row-span-3 3xl:row-span-5">
          <TopDealsBox />
        </div>

        {/* Total Users */}
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            IconBox={MdGroup}
            //title="Total Users"
            {...totalUsers}
            isSuccess={true}
          />
        </div>

        {/* Total Courses */}
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            IconBox={MdInventory2}
            //title="Total Courses"
            {...totalCourses}
            isSuccess={true}
          />
        </div>

        {/* Leads by Source */}
        <div className="box row-span-3 col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-5">
          <ChartBox
            chartType={'pie'}
            //title="Leads by Source"
            {...totalSource}
            isSuccess={true}
          />
        </div>

        {/* Bot Users */}
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            IconBox={MdAssessment}
           // title="Bot Users"
            {...botUsers}
            isSuccess={true}
          />
        </div>

        {/* Total Clicks */}
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'line'}
            IconBox={MdSwapHorizontalCircle}
           // title="Total Clicks"
            {...totalClicks}
            isSuccess={true}
          />
        </div>

        {/* Visits by Source */}
        <div className="box row-span-2 col-span-full xl:col-span-2 3xl:row-span-3">
          <ChartBox
            chartType={'area'}
          //  title="Visits by Source"
            {...visitsBySource}
            isSuccess={true}
          />
        </div>

        {/* Total Visits */}
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'bar'}
           // title="Total Visits"
            {...totalVisit}
            isSuccess={true}
          />
        </div>

        {/* Daily Bot Usage */}
        <div className="box col-span-full sm:col-span-1 xl:col-span-1 3xl:row-span-2">
          <ChartBox
            chartType={'bar'}
           // title="Daily Bot Usage"
            {...dailyBotUsage}
            isSuccess={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;