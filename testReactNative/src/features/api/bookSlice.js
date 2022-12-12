import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:8000/api/v1/' }), 
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
  })
})

export const { useGetListOfBooksQuery, useAddNewBookMutation, useDeleteBookMutation } = bookApi
