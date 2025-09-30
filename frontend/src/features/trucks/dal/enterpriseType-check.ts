"use server";

import { getMyProfile } from "@/features/profile/actions/profile-actions";
import { EnterpriseType } from "@/features/admin/enterprises/types/enterprise.type";

/**
 * Vérifie si l'utilisateur actuel est un transporteur (CARRIER)
 * @returns Promise<boolean> - true si l'utilisateur est un CARRIER, false sinon
 */
export const checkEnterpriseType = async (
  eType: EnterpriseType
): Promise<boolean> => {
  try {
    const profileResponse = await getMyProfile();

    // Vérifier si la requête a réussi
    if (profileResponse.status !== "SUCCESS" || !profileResponse.data) {
      return false;
    }

    // Vérifier si l'utilisateur a une entreprise et si le type est le meme type livrer dans l'argument
    const enterprise = profileResponse.data.enterprise;
    if (!enterprise || !enterprise.enterpriseType) {
      return false;
    }

    return enterprise.enterpriseType === eType;
  } catch (error) {
    console.error(`Erreur lors de la vérification du rôle ${eType}:`, error);
    return false;
  }
};
