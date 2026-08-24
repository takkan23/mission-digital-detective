/* =========================================================
   MISSION DIGITAL DETECTIVE
   GLOBAL TEACHER CLASSROOM FILTER
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    const classFilter =
      document.querySelector(
        "[data-teacher-class-filter]"
      );


    if (!classFilter) {
      return;
    }


    /* =====================================================
       LOAD CLASSROOMS
    ===================================================== */

    try {

      classFilter.disabled =
        true;


      classFilter.innerHTML =
        `
          <option value="">
            กำลังโหลดห้องเรียน...
          </option>
        `;


      /*
        ใช้ RPC เดียวกับหน้า Student Login
        ซึ่งมีอยู่แล้วในระบบ
      */

      const {
        data,
        error
      } =
        await supabaseClient.rpc(
          "get_classrooms"
        );


      if (error) {
        throw error;
      }


      let classrooms =
        Array.isArray(data)
          ?
          data
              .map(
                function (item) {
                  return item.class_name;
                }
              )
              .filter(Boolean)
          :
          [];


      /* ===================================================
         REMOVE DUPLICATE
      =================================================== */

      classrooms =
        [
          ...new Set(
            classrooms
          )
        ];


      /* ===================================================
         SORT CLASSROOM
         ม.2/3 → ม.2/4 → ม.2/10
      =================================================== */

      classrooms.sort(
        function (a, b) {

          const roomA =
            getRoomNumber(a);


          const roomB =
            getRoomNumber(b);


          return roomA - roomB;

        }
      );


      /* ===================================================
         CREATE OPTIONS
      =================================================== */

      classFilter.innerHTML =
        `
          <option value="">
            ทุกห้องเรียน
          </option>
        `;


      classrooms.forEach(
        function (className) {

          const option =
            document.createElement(
              "option"
            );


          option.value =
            className;


          option.textContent =
            className;


          classFilter.appendChild(
            option
          );

        }
      );


      classFilter.disabled =
        false;


      console.log(
        "Teacher classrooms:",
        classrooms
      );

    }

    catch (error) {

      console.error(
        "Load teacher classrooms error:",
        error
      );


      classFilter.innerHTML =
        `
          <option value="">
            โหลดห้องเรียนไม่สำเร็จ
          </option>
        `;

    }


    /* =====================================================
       ROOM NUMBER
    ===================================================== */

    function getRoomNumber(
      className
    ) {

      const parts =
        String(
          className || ""
        )
        .split("/");


      const room =
        Number(
          parts[
            parts.length - 1
          ]
        );


      return Number.isNaN(room)
        ?
        9999
        :
        room;

    }

  }
);