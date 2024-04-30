export function formatError(error) {
  if( typeof error === "string" ) return error
  return error?.response?.data?.errors?.message ?? 
    error?.data?.message ?? 
    error?.message ?? "error"
}