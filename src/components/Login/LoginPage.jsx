import { Button, Flex, Paper, Text } from "@mantine/core";
import React from "react";
import { notifications } from "@mantine/notifications";
import { NEUTRALS, PRIMARY_COLORS } from "../../shared/colors.const.jsx";
import OnboardingNavbar from "../OnboardingNavbar.jsx";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../../../assets/google-icon.svg";
import pb from "../../shared/pocketbase.js";
import { useLayoutContext } from "../Layout.context.jsx";

function LoginPage() {
  const navigate = useNavigate();

  const { setIsUserLoggedIn, setAppUserId } = useLayoutContext();

  //function to authenticate user using pocketbase oauth2
  const onSignInWithGoogle = async () => {
    try {
      const authData = await pb
        .collection("userslist")
        .authWithOAuth2({ provider: "google" });
      console.log(authData);

      console.log(pb.authStore.isValid);
      console.log(pb.authStore.token);
      console.log(pb.authStore.model.id);

      setIsUserLoggedIn(pb.authStore.isValid); //assigning a boolean value which indicates whether user is logged in or not.
      setAppUserId(pb.authStore.model.id); // saving id of the user in global context

      notifications.show({
        title: "Successfully Logined!",
        color: "green",
      });

      navigate("/"); //navigate the user to home screen after successful login
    } catch (e) {
      console.error(e);
      notifications.show({
        title: "You are not a registered user. Please sign up first",
        color: "red",
      });
    }
  };

  return (
    <>
      <OnboardingNavbar />

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
          <Flex direction="column" align="center" gap="32px">
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
            <Button onClick={onSignInWithGoogle} leftSection={<GoogleIcon />}>
              Sign In with Google
            </Button>
            <Text c="#8996A9">
              New user ?{" "}
              <span
                style={{
                  color: PRIMARY_COLORS.blue_main,
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Register here
              </span>
            </Text>
          </Flex>
        </Paper>
      </Flex>
    </>
  );
}

export default LoginPage;
