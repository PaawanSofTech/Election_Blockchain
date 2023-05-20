const form = document.querySelector('.navbar-form');
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting
  const query = document.querySelector('input[name="search"]').value;
  // Process the query and perform the search
  performSearch(query);
});
