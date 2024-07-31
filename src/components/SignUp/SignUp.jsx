/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Button, Flex, Grid, Paper, Select, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { NEUTRALS, PRIMARY_COLORS } from "../../shared/colors.const.jsx";
import OnboardingNavbar from "../OnboardingNavbar.jsx";
import {
  GENDERS,
  STATE_WISE_CITIES,
} from "../../shared/constants/general.const.js";
import pb from "../../shared/pocketbase.js";
import { useLayoutContext } from "../Layout.context.jsx";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const STATES = Object.keys(STATE_WISE_CITIES);

  const { appUserId } = useLayoutContext();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: null,
      gender: null,
      state: null,
      city: null,
      appUserId: "",
    },
    validate: {
      firstName: isNotEmpty("First Name is required"),
      lastName: isNotEmpty("Last Name is required"),
      email: (value) =>
        // eslint-disable-next-line no-nested-ternary
        value.length === 0
          ? "Email is required"
          : !emailRegex.test(value)
          ? "Invalid email"
          : null,
      dateOfBirth: isNotEmpty("Date of birth is required"),
      gender: isNotEmpty("Gender is required"),
      state: isNotEmpty("State is required"),
      city: isNotEmpty("City is required"),
    },
  });

  const submitFormAction = async () => {
    form.setFieldValue("appUserId");
    try {
      const record = await pb.collection("users").create(form.values);
      notifications.show({
        title: "Succesfully Registered",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Some error occurred while sending data",
        color: "red",
      });
    }
    form.reset();

    navigate("/");
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
            padding: "1.5rem",
            backgroundColor: NEUTRALS[1100],
          }}
        >
          <Flex
            direction="column"
            align="center"
            gap="1.5rem"
            component="form"
            onSubmit={form.onSubmit(() => {
              submitFormAction();
            })}
          >
            <Grid w="100%" gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="First Name"
                  placeholder="First Name"
                  {...form.getInputProps("firstName")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Last Name"
                  placeholder="Last Name"
                  {...form.getInputProps("lastName")}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              w="100%"
              label="Email"
              placeholder="eg.sample@gmail.com"
              {...form.getInputProps("email")}
            />
            <Grid w="100%" gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DatePickerInput
                  label="Date of Birth"
                  placeholder="DD/MM/YY"
                  maxDate={new Date()}
                  {...form.getInputProps("dateOfBirth")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  data={Object.values(GENDERS)}
                  clearable
                  {...form.getInputProps("gender")}
                />
              </Grid.Col>
            </Grid>
            <Grid w="100%" gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="State"
                  placeholder="Select state"
                  data={STATES}
                  clearable
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("state")}
                  value={form.values.state}
                  onChange={(value) => {
                    form.setFieldValue("state", value);
                    form.setFieldValue("city", null);
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="City"
                  placeholder="Select city"
                  data={STATE_WISE_CITIES[form.values.state]}
                  disabled={!form.values.state}
                  clearable
                  searchable
                  nothingFoundMessage="Nothing found..."
                  {...form.getInputProps("city")}
                />
              </Grid.Col>
            </Grid>
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
              Create Account
            </Button>
          </Flex>
        </Paper>
      </Flex>
    </>
  );
}
export default SignUp;
