//import React from 'react';
import toast from 'react-hot-toast';
import { topCoursesData, TopCourse } from '../../data/topCourses';

const TopCoursesBox = () => {
  //const tempTotalEntries = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="w-full p-0 m-0 flex flex-col items-stretch gap-6 xl:gap-4 2xl:gap-9">
      <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
        Популярные курсы
      </span>
      <div className="w-full flex flex-col items-stretch gap-3">
        {topCoursesData.map((course: TopCourse) => (
          <button
            onClick={() => toast(`Выбран курс: ${course.title}`, { icon: '📚' })}
            key={course.id}
            className="w-full flex justify-between items-center h-auto btn btn-ghost px-1 py-2 hover:bg-gray-50"
          >
            <div className="flex flex-col items-start gap-1 flex-1 overflow-hidden">
              <span 
                className="text-sm xl:text-[13px] 2xl:text-lg 3xl:text-xl m-0 p-0 text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                title={course.title}
              >
                {course.title}
              </span>
              <span className="text-xs xl:text-[10px] 2xl:text-sm 3xl:text-base text-gray-500">
                {course.provider}
              </span>
            </div>
            <span className="font-semibold text-lg xl:text-base 2xl:text-lg 3xl:text-xl text-primary ml-4">
              {course.clicks}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopCoursesBox;