import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Medicine,
  MedicineAvailability,
  OrderRecord,
  PaymentMode,
  PaymentStatus,
  UserProfile,
  UserRole,
} from "../backend";
import { useActor } from "./useActor";

// ── User queries ──────────────────────────────────────────────────────────────

export function useGetCurrentUser() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<UserProfile>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCurrentUser();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      email: string;
      role: UserRole;
      phone: string;
      address: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createUser(
        params.name,
        params.email,
        params.role,
        params.phone,
        params.address,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      email: string;
      phone: string;
      address: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateUserProfile(
        params.name,
        params.email,
        params.phone,
        params.address,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

// ── Medicine queries ──────────────────────────────────────────────────────────

export function useGetAllMedicines() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: ["allMedicines"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMedicinesByName();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetSenderMedicines() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: ["senderMedicines"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSenderMedicines();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMedicineById(medicineId: string) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Medicine>({
    queryKey: ["medicine", medicineId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getMedicineById(medicineId);
    },
    enabled: !!actor && !actorFetching && !!medicineId,
  });
}

export function useUploadMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      senderName: string;
      medicineName: string;
      description: string;
      cost: bigint;
      discount: bigint;
      availability: MedicineAvailability;
      paymentMode: PaymentMode;
      imageUrl: string;
      locationAddress: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.uploadMedicine(
        params.senderName,
        params.medicineName,
        params.description,
        params.cost,
        params.discount,
        params.availability,
        params.paymentMode,
        params.imageUrl,
        params.locationAddress,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["senderMedicines"] });
      queryClient.invalidateQueries({ queryKey: ["allMedicines"] });
    },
  });
}

export function useUpdateMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      medicineId: string;
      name: string;
      description: string;
      cost: bigint;
      discount: bigint;
      availability: MedicineAvailability;
      paymentMode: PaymentMode;
      imageUrl: string;
      locationAddress: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateMedicine(
        params.medicineId,
        params.name,
        params.description,
        params.cost,
        params.discount,
        params.availability,
        params.paymentMode,
        params.imageUrl,
        params.locationAddress,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["senderMedicines"] });
      queryClient.invalidateQueries({ queryKey: ["allMedicines"] });
      queryClient.invalidateQueries({
        queryKey: ["medicine", variables.medicineId],
      });
    },
  });
}

export function useDeleteMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (medicineId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteMedicine(medicineId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["senderMedicines"] });
      queryClient.invalidateQueries({ queryKey: ["allMedicines"] });
    },
  });
}

// ── Order queries ─────────────────────────────────────────────────────────────

export function useGetSenderOrders() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<OrderRecord[]>({
    queryKey: ["senderOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSenderOrders();
    },
    enabled: !!actor && !actorFetching,
    refetchOnWindowFocus: true,
  });
}

export function useGetCustomerOrders() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<OrderRecord[]>({
    queryKey: ["customerOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerOrders();
    },
    enabled: !!actor && !actorFetching,
    refetchOnWindowFocus: true,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      medicineId: string;
      customerName: string;
      paymentMode: PaymentMode;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.placeOrder(
        params.medicineId,
        params.customerName,
        params.paymentMode,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      orderId: string;
      status: string;
      paymentStatus: PaymentStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(
        params.orderId,
        params.status,
        params.paymentStatus,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["senderOrders"] });
    },
  });
}
