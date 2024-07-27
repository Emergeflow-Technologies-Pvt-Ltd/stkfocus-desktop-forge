import { Button, Flex, NumberInput, Paper, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { notifications } from "@mantine/notifications";
import { NEUTRALS, PRIMARY_COLORS } from "../../shared/colors.const.jsx";
import { auth } from "../../firebase.config.js";
import Verification from "../Verification/Verification.jsx";
import OnboardingNavbar from "../OnboardingNavbar.jsx";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const mobileNumberRegex = /^\d{10}$/;
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      mobileNumber: "",
    },
    validate: {
      mobileNumber: (value) =>
        mobileNumberRegex.test(value) ? null : "Please enter a 10-digit number",
    },
  });

  const handleLaunchWidget = () => {
    navigate("/widget");
    window.electronAPI.launchWidget();
  };

  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);

  function onCaptchVerify() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("Callback Called!!!", response);
          // onSignup();
        },
        "expired-callback": () => {},
      }
    );
  }

  function onSignup(phoneNumber) {
    if (phoneNumber) {
      onCaptchVerify();

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
          setIsVerificationCodeSent(true);
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
    onSignup(form.values.mobileNumber);
  };

  return (
    <>
      <OnboardingNavbar />
      {isVerificationCodeSent ? (
        <Verification
          mobileNumber={form.values.mobileNumber}
          backToLoginScreen={() => {
            setIsVerificationCodeSent(false);
          }}
        />
      ) : (
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
              <Text style={{ fontSize: "1.5rem" }}>
                Welcome to{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontStyle: "italic",
                    color: PRIMARY_COLORS.blue_main,
                  }}
                >
                  Stkfocus!
                </span>
              </Text>
              <Flex w="100%" direction="column" gap="16px">
                <NumberInput
                  size="md"
                  label="Mobile Number"
                  prefix="+91 "
                  placeholder="+91 00000 00000"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...form.getInputProps("mobileNumber")}
                  hideControls
                  allowNegative={false}
                  allowDecimal={false}
                  w="100%"
                />
                <Text c="#8996A9">
                  Please enter your phone number to receive OTP.
                </Text>
                <div
                  id="recaptcha-container"
                  className="justify-center flex"
                ></div>
              </Flex>
              <Button
                fullWidth
                style={{
                  backgroundColor: PRIMARY_COLORS.blue_main,
                  fontSize: "16px",
                  color: "black",
                  fontWeight: 600,
                }}
                type="submit"
                // disabled={!mobileNumberRegex.test(form.values.mobileNumber)}
              >
                Get OTP
              </Button>
              <Button
                mt="md"
                bg={PRIMARY_COLORS["blue_main"]}
                onClick={handleLaunchWidget}
                styles={{
                  label: { color: "black" },
                }}
              >
                Launch Widget
              </Button>
              {/* <Text c="#8996A9">
                New user ?{' '}
                <span
                  style={{
                    color: PRIMARY_COLORS.blue_main,
                  }}
                >
                  Register here
                </span>
              </Text> */}
            </Flex>
          </Paper>
        </Flex>
      )}
    </>
  );
}

export default LoginPage;
