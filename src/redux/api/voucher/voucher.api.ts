/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

const voucherApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllVouchers: build.query({
      query: (params: any) => ({
        url: "/voucher",
        method: "GET",
        params: params,
      }),
      providesTags: ["all-vouchers"],
    }),

    getSingleVoucher: build.query({
      query: (id: string) => ({
        url: `/voucher/${id}`,
        method: "GET",
      }),
      providesTags: ["single-voucher"],
    }),

    getSingleVoucherForPrint: build.query({
      query: (id: string) => ({
        url: `/voucher/print/${id}`,
        method: "GET",
      }),
      providesTags: ["single-voucher"],
    }),

    createVoucher: build.mutation({
      query: (data) => ({
        url: "/voucher",
        method: "POST",
        data,
      }),
      invalidatesTags: ["all-vouchers"],
    }),

    updateVoucher: build.mutation({
      query: (options) => ({
        url: `/voucher/${options.voucherId}`,
        method: "PATCH",
        data: options?.data,
      }),
      invalidatesTags: ["all-vouchers", "single-voucher"],
    }),

    deleteVoucher: build.mutation({
      query: (id: string) => ({
        url: `/voucher/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["all-vouchers", "single-voucher"],
    }),
  }),
});

export const {
  useCreateVoucherMutation,
  useGetAllVouchersQuery,
  useGetSingleVoucherQuery,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
  useLazyGetSingleVoucherQuery,
  useGetSingleVoucherForPrintQuery,
  useLazyGetSingleVoucherForPrintQuery,
} = voucherApi;
