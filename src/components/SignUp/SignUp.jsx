import React from "react";
import {
  Button,
  Flex,
  Grid,
  Paper,
  Select,
  TextInput,
  Text,
} from "@mantine/core";
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
import { useNavigate } from "react-router-dom";

function SignUp() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const STATES = Object.keys(STATE_WISE_CITIES);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      emailVisibility: true,
      dateOfBirth: null,
      gender: null,
      state: null,
      city: null,
      password: "12345678",
      passwordConfirm: "12345678",
    },
    validate: {
      firstName: isNotEmpty("First Name is required"),
      lastName: isNotEmpty("Last Name is required"),
      email: (value) =>
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
    try {
      const queryString = `email="${form.values.email}"`;
      console.log(queryString);
      const record = await pb
        .collection("userslist")
        .getFirstListItem(queryString);
      if (record) {
        notifications.show({
          title: "Account aldready exists",
          color: "yellow",
        });
      }
    } catch (error) {
      console.error(error);
      try {
        // eslint-disable-next-line no-unused-vars
        const record = await pb.collection("userslist").create(form.values);
        notifications.show({
          title: "Succesfully Registered",
          color: "green",
        });
        navigate("/");
      } catch (error) {
        console.error(error);
        notifications.show({
          title: "Some error occurred while sending data",
          color: "red",
        });
      }
    }

    form.reset();
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
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="First Name"
                  placeholder="First Name"
                  {...form.getInputProps("firstName")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Last Name"
                  placeholder="Last Name"
                  {...form.getInputProps("lastName")}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              w="100%"
              label="Email (Please enter your google email address)"
              placeholder="eg.sample@gmail.com"
              {...form.getInputProps("email")}
            />
            <Grid w="100%" gutter="lg">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <DatePickerInput
                  label="Date of Birth"
                  placeholder="DD/MM/YY"
                  maxDate={new Date()}
                  {...form.getInputProps("dateOfBirth")}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
              <Grid.Col span={{ base: 12, sm: 6 }}>
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
            <Text c="#8996A9">
              Already have an account?{" "}
              <span
                style={{
                  color: PRIMARY_COLORS.blue_main,
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                Login
              </span>
            </Text>
          </Flex>
        </Paper>
      </Flex>
    </>
  );
}
export default SignUp;
