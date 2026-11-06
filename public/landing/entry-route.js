// Mantém convites e retornos OAuth gerados pelo motor compatíveis com a nova entrada.
const query=new URLSearchParams(location.search);
if(['invite','connected','connection_error'].some(key=>query.has(key)))location.replace('/app'+location.search);
