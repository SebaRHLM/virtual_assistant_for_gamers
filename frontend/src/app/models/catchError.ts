async function catchError(promise:any) {
  try {
    let data = await promise;
    return [data, null];
  } catch (error) {
    console.log
    return [null, error];
  }
}