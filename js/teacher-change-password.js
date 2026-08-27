/* =========================================================
   TEACHER CHANGE PASSWORD
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {


    const form =
      document.getElementById(
        "teacherChangePasswordForm"
      );


    const currentPassword =
      document.getElementById(
        "currentTeacherPassword"
      );


    const newPassword =
      document.getElementById(
        "newTeacherPassword"
      );


    const confirmPassword =
      document.getElementById(
        "confirmTeacherPassword"
      );


    const message =
      document.getElementById(
        "teacherPasswordMessage"
      );


    const button =
      document.getElementById(
        "changeTeacherPasswordButton"
      );


    form.addEventListener(
      "submit",
      async function (
        event
      ) {


        event.preventDefault();


        message.textContent =
          "";


        const token =
          localStorage.getItem(
            "teacherSessionToken"
          );


        if (
          !token
        ) {

          window.location.href =
            "../index.html";

          return;

        }


        const current =
          currentPassword.value;


        const next =
          newPassword.value;


        const confirm =
          confirmPassword.value;


        if (
          next.length < 6
        ) {

          showMessage(
            "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร",
            false
          );

          return;

        }


        if (
          next !== confirm
        ) {

          showMessage(
            "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน",
            false
          );

          return;

        }


        if (
          current === next
        ) {

          showMessage(
            "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม",
            false
          );

          return;

        }


        const oldText =
          button.textContent;


        button.disabled =
          true;


        button.textContent =
          "UPDATING...";


        try {


          const {
            data,
            error
          } =
            await supabaseClient.rpc(
              "change_teacher_password",
              {

                p_session_token:
                  token,

                p_current_password:
                  current,

                p_new_password:
                  next

              }
            );


          if (
            error
          ) {

            throw error;

          }


          if (
            !data
            ||
            data.length === 0
          ) {

            throw new Error(
              "ไม่พบผลการเปลี่ยนรหัสผ่าน"
            );

          }


          const result =
            data[0];


          if (
            result.success !== true
          ) {

            showMessage(
              result.message
              ||
              "เปลี่ยนรหัสผ่านไม่สำเร็จ",
              false
            );

            return;

          }


          showMessage(
            "✓ เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
            true
          );


          currentPassword.value =
            "";


          newPassword.value =
            "";


          confirmPassword.value =
            "";


          /*
            หลังเปลี่ยนรหัสสำเร็จ
            ให้ Logout เพื่อทดสอบรหัสใหม่ทันที
          */

          setTimeout(
            async function () {

              await logoutTeacher();

            },
            1200
          );


        }

        catch (
          error
        ) {


          console.error(
            "Change Teacher Password Error:",
            error
          );


          showMessage(
            "ไม่สามารถเปลี่ยนรหัสผ่านได้",
            false
          );


        }

        finally {


          button.disabled =
            false;


          button.textContent =
            oldText;

        }

      }
    );


    function showMessage(
      text,
      success
    ) {


      message.textContent =
        text;


      message.style.color =
        success
          ?
          "#2cff8c"
          :
          "#ff759e";

    }


  }
);