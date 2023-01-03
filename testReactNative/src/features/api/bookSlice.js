import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import * as SecureStore from 'expo-secure-store';

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api/v1/', // 192.168.1.20 et 10.0.2.2:8000
    prepareHeaders: async (headers) => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        headers.set('authorization', `Token ${token}`)
      } else {
        alert("mince, petite erreur !")
      }
      return headers
    },
   }), 
  tagTypes: ['Book'],
  endpoints: builder => ({
    getListOfBooks: builder.query({
      query: () => `books/`,
      providesTags: ['Book']
    }),
    addNewBook: builder.mutation({
      query: initialBook => ({
        url: 'books/',
        method: 'POST',
        body: initialBook
      }),
      invalidatesTags: ['Book']
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Book'],
    }),
    updateBook: builder.mutation({
      query(data) {
        const { id, ...body } = data
        return {
          url: `books/${id}/`,
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: ['Book'], // ne recharger que le livre modifié
    }),
    logIn: builder.mutation ({
      query(creditentials) {
        return {
          url: `dj-rest-auth/login/`,
          method: 'POST',
          body: creditentials,
        }
      },
      transformResponse: async (response, meta, arg) => {
        await SecureStore.setItemAsync('token', response.key);
      },
    }),
    registration: builder.mutation ({
      query(creditentials) {
        return {
          url: `dj-rest-auth/registration/`,
          method: 'POST',
          body: creditentials,
        }
      },
      transformResponse: async (response, meta, arg) => {
        await SecureStore.setItemAsync('token', response.key);
      },
    }),
    logOut: builder.mutation ({
      query(creditentials) {
        return {
          url: `dj-rest-auth/logout/`,
          method: 'POST',
          body: creditentials,
        }
      }
    }),
  })
})

export const { useGetListOfBooksQuery, useAddNewBookMutation, 
  useDeleteBookMutation, useUpdateBookMutation,
  useLogInMutation, useRegistrationMutation,
  useLogOutMutation } = bookApi
