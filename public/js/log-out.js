/**
 * Log the user out.
 * Remove the authentication cookie and reload the page
 */
function logout(event) {
  event.preventDefault();
  fetch("/account/logout")
    .then((response) => {
      location.reload();
    })
    .catch((err) => {
      console.error(err);
    });
}
