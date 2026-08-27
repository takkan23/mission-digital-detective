/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER GLOBAL CONFIG
========================================================= */


/* =========================================================
   CLASSROOMS
   ห้องเรียนที่ใช้ในระบบครู
========================================================= */

const TEACHER_CLASSROOMS = [

  "ม.2/3",
  "ม.2/4",
  "ม.2/7",
  "ม.2/9",
  "ม.2/10",
  "ม.2/12"

];


/* =========================================================
   CREATE CLASSROOM OPTIONS
========================================================= */

function createTeacherClassroomOptions(
  selectElement,
  includeAll = true
) {

  if (!selectElement) {
    return;
  }


  const oldValue =
    selectElement.value;


  selectElement.innerHTML =
    "";


  /* ทุกห้องเรียน */

  if (includeAll) {

    const allOption =
      document.createElement(
        "option"
      );

    allOption.value =
      "";

    allOption.textContent =
      "ทุกห้องเรียน";

    selectElement.appendChild(
      allOption
    );

  }


  /* ห้อง ม.2/3 - ม.2/12 */

  TEACHER_CLASSROOMS.forEach(
    function (className) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        className;

      option.textContent =
        className;

      selectElement.appendChild(
        option
      );

    }
  );


  /* คืนค่าห้องเดิม */

  if (
    TEACHER_CLASSROOMS.includes(
      oldValue
    )
  ) {

    selectElement.value =
      oldValue;

  }

}


/* =========================================================
   CLASSROOM SORT
========================================================= */

function sortTeacherClassrooms(
  classA,
  classB
) {

  const indexA =
    TEACHER_CLASSROOMS.indexOf(
      classA
    );

  const indexB =
    TEACHER_CLASSROOMS.indexOf(
      classB
    );


  if (
    indexA === -1
    &&
    indexB === -1
  ) {

    return 0;

  }


  if (
    indexA === -1
  ) {

    return 1;

  }


  if (
    indexB === -1
  ) {

    return -1;

  }


  return indexA - indexB;

}