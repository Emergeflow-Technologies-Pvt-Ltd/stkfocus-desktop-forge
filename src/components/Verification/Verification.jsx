import { Button, Flex, Paper, Text, PinInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { notifications } from "@mantine/notifications";
import { auth } from "../../firebase.config.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { NEUTRALS, PRIMARY_COLORS } from "../../shared/colors.const.jsx";
import { useNavigate } from "react-router-dom";
function Verification({ mobileNumber, backToLoginScreen }) {
  const verificationCodeRegex = /^\d{6}$/;
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      verificationCode: "",
    },
    validate: {
      verificationCode: (value) =>
        verificationCodeRegex.test(value)
          ? null
          : "Please enter verification code !!",
    },
  });
  const [user, setUser] = useState(null);
  function onOTPVerify() {
    window.confirmationResult
      .confirm(form.values.verificationCode)
      .then(async (res) => {
        // eslint-disable-next-line no-underscore-dangle
        console.log(res._tokenResponse);
        setUser(res.user);

        // TODO: Set isUserLoggedIn (received from Layout.context) to true

        notifications.show({
          title: "Succesfully Verified !!",
          color: "green",
        });
        // eslint-disable-next-line no-underscore-dangle
        if (res._tokenResponse.isNewUser) {
          navigate("/signup");
        } else {
          navigate("/");
        }
        return null;
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "Enter correct verification code !!",
          color: "red",
        });
      });
  }
  function onCaptchVerify() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          resendCode();
        },
        "expired-callback": () => {},
      }
    );
  }
  function resendCode(phoneNumber) {
    if (phoneNumber) {
      onCaptchVerify();
      if (window.confirmationResult) {
        // Clear previous verification attempt
        window.confirmationResult = null;
      }
      const appVerifier = window.recaptchaVerifier;
      const phoneNumberWithPrefix = "+91" + phoneNumber;
      console.log("phoneNumberWithPrefix", phoneNumberWithPrefix);
      signInWithPhoneNumber(auth, phoneNumberWithPrefix, appVerifier)
        .then((confirmationResult) => {
          console.log("Confirmation Result", confirmationResult);
          window.confirmationResult = confirmationResult;
          notifications.show({
            title: "Succesfully sent the verification code !!",
            color: "green",
          });
        })
        .catch((error) => {
          console.log(error);
          notifications.show({
            title: "Some error ocurred while sending the verification code !!",
            color: "red",
          });
        });
    }
  }
  const submitFormAction = () => {
    console.log("Verification code submitted !!", form.values.verificationCode);
    onOTPVerify();
  };
  return (
    <Flex
      justify="center"
      align="center"
      style={{
        width: "100%",
        height: "92vh",
        backgroundColor: NEUTRALS[1100],
      }}
    >
      <Paper
        withBorder
        style={{
          width: "50%",
          maxWidth: "560px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "50px",
          paddingBottom: "50px",
          backgroundColor: NEUTRALS[1100],
        }}
      >
        <Flex
          direction="column"
          align="center"
          gap="32px"
          component="form"
          onSubmit={form.onSubmit(() => {
            submitFormAction();
          })}
        >
          <Text
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: PRIMARY_COLORS.blue_main,
            }}
          >
            Verification Code
          </Text>
          <Text w="70%" style={{ textAlign: "center" }}>
            Please enter the verification code sent to +91 {mobileNumber}.{" "}
            <span
              style={{ color: PRIMARY_COLORS.blue_main, cursor: "pointer" }}
              onClick={backToLoginScreen}
            >
              Edit number
            </span>
          </Text>
          <PinInput
            placeholder=""
            length={6}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...form.getInputProps("verificationCode")}
            type="number"
          />
          <Text c="#8996A9">
            Didn’t receive code?{" "}
            <span
              style={{
                color: PRIMARY_COLORS.blue_main,
                cursor: "pointer",
              }}
              onClick={() => {
                resendCode(mobileNumber);
              }}
            >
              resend
            </span>
          </Text>
          <Button
            fullWidth
            style={{
              backgroundColor: PRIMARY_COLORS.blue_main,
              fontSize: "16px",
              color: "black",
              fontWeight: "normal",
            }}
            type="submit"
          >
            Verify & Continue
          </Button>
          <div id="recaptcha-container" className="justify-center flex"></div>
        </Flex>
      </Paper>
    </Flex>
  );
}
export default Verification;
