export const logout = async (ctx: RouterContext) => {
  ctx.cookies.delete('token');
  ctx.response.status = 200;
  ctx.response.body = { message: 'Wylogowano' };
};
