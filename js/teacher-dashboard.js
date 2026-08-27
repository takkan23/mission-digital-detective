/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER DASHBOARD
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function () {


    /* =====================================================
       TEACHER LOGIN
    ===================================================== */

    const teacherLoggedIn =
      localStorage.getItem(
        "teacherLoggedIn"
      );


    if (
      teacherLoggedIn !==
      "true"
    ) {

      window.location.href =
        "../index.html";

      return;

    }


    /* =====================================================
       STATE
    ===================================================== */

    let students =
      [];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const classFilter =
      document.getElementById(
        "dashboardClassFilter"
      );


    const refreshButton =
      document.getElementById(
        "refreshDashboardButton"
      );


    const logoutButton =
      document.getElementById(
        "teacherLogoutButton"
      );


    /* =====================================================
       LOAD DATA
    ===================================================== */

    async function loadDashboard() {


      refreshButton.disabled =
        true;


      refreshButton.textContent =
        "LOADING...";


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "get_teacher_dashboard_progress"
          );


        if (
          error
        ) {

          throw error;

        }


        students =
          Array.isArray(
            data
          )
          ?
          data
          :
          [];


        buildClassFilter();


        renderDashboard();


      }

      catch (error) {


        console.error(
          "Teacher Dashboard Error:",
          error
        );


        alert(
          "ไม่สามารถโหลดข้อมูล Dashboard ได้"
        );


      }

      finally {


        refreshButton.disabled =
          false;


        refreshButton.textContent =
          "↻ REFRESH";

      }

    }


    /* =====================================================
       CLASS FILTER
    ===================================================== */

function buildClassFilter() {

  const oldValue =
    classFilter.value;


  const classes =
    [
      ...new Set(
        students
          .map(
            function (student) {
              return student.class_name;
            }
          )
          .filter(Boolean)
      )
    ];


  classes.sort(
    function (a, b) {

      const roomA =
        Number(
          String(a)
            .split("/")[1]
        );


      const roomB =
        Number(
          String(b)
            .split("/")[1]
        );


      return roomA - roomB;

    }
  );


  classFilter.innerHTML =
    `
      <option value="">
        ทุกห้องเรียน
      </option>
    `;


  classes.forEach(
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


  if (
    classes.includes(
      oldValue
    )
  ) {

    classFilter.value =
      oldValue;

  }

}
    /* =====================================================
       CURRENT STUDENTS
    ===================================================== */

    function getCurrentStudents() {


      const className =
        classFilter.value;


      if (
        !className
      ) {

        return students;

      }


      return students.filter(
        function (
          student
        ) {

          return (
            student.class_name ===
            className
          );

        }
      );

    }


    /* =====================================================
       PERCENT
    ===================================================== */

    function getPercent(
      count,
      total
    ) {


      if (
        total === 0
      ) {

        return 0;

      }


      return Math.round(
        count
        /
        total
        *
        100
      );

    }


    /* =====================================================
       RENDER
    ===================================================== */

    function renderDashboard() {


      const current =
        getCurrentStudents();


      const total =
        current.length;
      
      const now =
  Date.now();


const onlineStudents =
  current.filter(
    function (
      student
    ) {

      if (
        !student.last_seen_at
      ) {

        return false;

      }


      const lastSeen =
        new Date(
          student.last_seen_at
        ).getTime();


      /*
        Heartbeat ทุก 30 วินาที
        ถือว่า ONLINE ถ้าเห็นภายใน 90 วินาที
      */

      return (
        now - lastSeen
        <=
        90000
      );

    }
  );


const onlineCount =
  onlineStudents.length;


      const discover =
        current.filter(
          function (
            student
          ) {

            return (
              student.discover_completed ===
              true
            );

          }
        ).length;


      const analyze =
        current.filter(
          function (
            student
          ) {

            return (
              student.analyze_completed ===
              true
            );

          }
        ).length;


      const reason =
        current.filter(
          function (
            student
          ) {

            return (
              student.reason_completed ===
              true
            );

          }
        ).length;


      const evolve =
        current.filter(
          function (
            student
          ) {

            return (
              student.evolve_completed ===
              true
            );

          }
        ).length;


      const evolveWaiting =
        current.filter(
          function (
            student
          ) {

            return (
              student.evolve_submitted ===
              true
              &&
              student.evolve_completed !==
              true
            );

          }
        ).length;


      const dareComplete =
        current.filter(
          function (
            student
          ) {

            return (
              student.discover_completed ===
              true
              &&
              student.analyze_completed ===
              true
              &&
              student.reason_completed ===
              true
              &&
              student.evolve_completed ===
              true
            );

          }
        ).length;


      /* =================================================
         OVERVIEW
      ================================================= */

      setText(
        "dashboardTotalStudents",
        total
      );
      setText(
        "dashboardOnlineStudents",
        onlineCount
      );

      setText(
        "dashboardDiscoverCompleted",
        discover
      );


      setText(
        "dashboardAnalyzePassed",
        analyze
      );


      setText(
        "dashboardReasonPassed",
        reason
      );


      setText(
        "dashboardEvolvePassed",
        evolve
      );


      /* =================================================
         MODULES
      ================================================= */

      setText(
        "moduleDiscoverCount",
        discover
      );


      setText(
        "moduleAnalyzeCount",
        analyze
      );


      setText(
        "moduleReasonCount",
        reason
      );


      setText(
        "moduleEvolveWaiting",
        evolveWaiting
      );


      setText(
        "moduleDareComplete",
        dareComplete
      );


      /* =================================================
         PROGRESS
      ================================================= */

      setProgress(
        "discoverProgressBar",
        "discoverProgressText",
        getPercent(
          discover,
          total
        )
      );


      setProgress(
        "analyzeProgressBar",
        "analyzeProgressText",
        getPercent(
          analyze,
          total
        )
      );


      setProgress(
        "reasonProgressBar",
        "reasonProgressText",
        getPercent(
          reason,
          total
        )
      );


      setProgress(
        "evolveProgressBar",
        "evolveProgressText",
        getPercent(
          evolve,
          total
        )
      );

    }


    /* =====================================================
       SET TEXT
    ===================================================== */

    function setText(
      id,
      value
    ) {


      const element =
        document.getElementById(
          id
        );


      if (
        element
      ) {

        element.textContent =
          value;

      }

    }


    /* =====================================================
       SET PROGRESS
    ===================================================== */

    function setProgress(
      barId,
      textId,
      percent
    ) {


      const bar =
        document.getElementById(
          barId
        );


      const text =
        document.getElementById(
          textId
        );


      if (
        bar
      ) {

        bar.style.width =
          percent
          +
          "%";

      }


      if (
        text
      ) {

        text.textContent =
          percent
          +
          "%";

      }

    }


    /* =====================================================
       FILTER
    ===================================================== */

    classFilter.addEventListener(
      "change",
      renderDashboard
    );


    /* =====================================================
       REFRESH
    ===================================================== */

    refreshButton.addEventListener(
      "click",
      loadDashboard
    );


    /* =====================================================
       LOGOUT
    ===================================================== */

    logoutButton.addEventListener(
      "click",
      function () {


        localStorage.removeItem(
          "teacherLoggedIn"
        );


        localStorage.removeItem(
          "teacherId"
        );


        localStorage.removeItem(
          "userRole"
        );


        window.location.href =
          "../index.html";

      }
    );

/* =====================================================
   AUTO REFRESH ONLINE STATUS
===================================================== */

const dashboardAutoRefresh =
  setInterval(
    async function () {

      try {

        await loadDashboard();

      }
      catch (error) {

        console.error(
          "AUTO REFRESH DASHBOARD ERROR:",
          error
        );

      }

    },
    10000
  );
  window.addEventListener(
  "beforeunload",
  function () {

    clearInterval(
      dashboardAutoRefresh
    );

  }
);
    /* =====================================================
       START
    ===================================================== */

    await loadDashboard();


  }
);