import React, { useEffect, useState } from "react";
import {
  GENDERS,
  STATE_WISE_CITIES,
} from "../../../shared/constants/general.const.js";
import { DatePickerInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import pb from "../../../shared/pocketbase";
import { Flex, Text, Grid, TextInput, Select, Button } from "@mantine/core";
import EditIcon from "../../../../assets/edit-icon.svg";
import moment from "moment";
import { useLayoutContext } from "../../Layout.context.jsx";
function ProfileDetails() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const STATES = Object.keys(STATE_WISE_CITIES); // list of distinct states
  const [isEditing, setIsEditing] = useState(false);

  const { appUserId, userDetails, fetchUserDetails } = useLayoutContext();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: null,
      gender: "",
      state: "",
      city: "",
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

  // function to initialize form data with user's original values
  const initializeWithOrginalData = (user) => {
    const { firstName, lastName, email, dateOfBirth, gender, state, city } =
      user;
    form.setValues({
      firstName: firstName,
      lastName: lastName,
      email: email,
      dateOfBirth: moment(dateOfBirth).toDate(),
      gender: gender,
      state: state,
      city: city,
    });
  };

  //function to edit details of user
  const editDetails = async (userId) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const record = await pb
        .collection("userslist")
        .update(userId, form.values);
      notifications.show({
        title: "Succesfully Updated",
        color: "green",
      });
      fetchUserDetails(userId);
    } catch {
      notifications.show({
        title: "Some error occurred while updating data",
        color: "red",
      });
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    initializeWithOrginalData(userDetails); //re-assign form data with user's original values
  };

  useEffect(() => {
    initializeWithOrginalData(userDetails);
  }, [appUserId]);

  return (
    <Flex
      direction={"column"}
      gap={"1rem"}
      component="form"
      onSubmit={form.onSubmit(() => {
        editDetails(appUserId);
      })}
    >
      <Flex align={"center"} gap={"lg"}>
        {isEditing ? (
          <>
            <Button type="submit">Save</Button>
            <Button
              bg={"red"}
              onClick={() => {
                cancelEditing();
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Flex
            align={"center"}
            gap={4}
            onClick={() => {
              setIsEditing(true);
            }}
            style={{
              cursor: "pointer",
              marginBottom: "10px",
              width: "fit-content",
            }}
          >
            <Text c={"#738496"}>Edit</Text>
            <EditIcon />
          </Flex>
        )}
      </Flex>
      <Flex direction="column" align="center" gap="1.5rem">
        <Grid w="100%" gutter="lg">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="First Name"
              placeholder="First Name"
              readOnly={!isEditing}
              {...form.getInputProps("firstName")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              readOnly={!isEditing}
              {...form.getInputProps("lastName")}
            />
          </Grid.Col>
        </Grid>
        <TextInput
          w="100%"
          label="Email"
          placeholder="eg.sample@gmail.com"
          readOnly={!isEditing}
          {...form.getInputProps("email")}
        />
        <Grid w="100%" gutter="lg">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <DatePickerInput
              label="Date of Birth"
              placeholder="DD/MM/YY"
              readOnly={!isEditing}
              maxDate={new Date()}
              {...form.getInputProps("dateOfBirth")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Select
              label="Gender"
              placeholder="Select gender"
              readOnly={!isEditing}
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
              readOnly={!isEditing}
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
              readOnly={!isEditing}
              data={STATE_WISE_CITIES[form.values.state]}
              disabled={!form.values.state}
              clearable
              searchable
              nothingFoundMessage="Nothing found..."
              {...form.getInputProps("city")}
            />
          </Grid.Col>
        </Grid>
      </Flex>
    </Flex>
  );
}
export default ProfileDetails;
