"use server";
import { z } from "zod";

import { ActionsResponse } from "@/lib/types/actions.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { registerServerSchema } from "../schemas/register-schema";
import { errorResponse } from "@/lib/helpers/error-response";

export const register = async (
  data: z.infer<typeof registerServerSchema>
): Promise<ActionsResponse<null>> => {
  try {
    const validatedData = registerServerSchema.parse(data);

    // Préparer le payload selon le type d'utilisateur
    let apiData: any = {
      email: validatedData.email,
      password: validatedData.password,
      userType: validatedData.userType,
      phoneNumber: validatedData.phoneNumber,
    };

    if (validatedData.userType === "PATIENT") {
      apiData.firstName = validatedData.firstName;
      apiData.lastName = validatedData.lastName;
      apiData.dateOfBirth = validatedData.dateOfBirth;
      if (validatedData.address && validatedData.address.trim() !== "") {
        apiData.address = validatedData.address;
      }
    } else if (validatedData.userType === "PROVIDER") {
      apiData.firstName = validatedData.firstName;
      apiData.lastName = validatedData.lastName;
      apiData.specialty = validatedData.specialty;
      apiData.licenseNumber = validatedData.licenseNumber;
    } else if (validatedData.userType === "FACILITY") {
      apiData.name = validatedData.facilityName;
      apiData.type = validatedData.facilityType;
      apiData.address = validatedData.address;
    }

    console.log("API Data envoyé:", apiData); // Pour déboguer
    
    const response = await axiosWrapper.post("/auth/register", apiData);

    return {
      status: "SUCCESS",
      statusCode: response.status,
      message: response.data.message || "Inscription réussie",
      data: null,
    };
  } catch (error) {
    console.error("Erreur register:", error); // Pour voir l'erreur exacte
    return errorResponse(error, "register");
  }
};