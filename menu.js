// navigation menu shared across all individual pages
(function() {
  // List of pages for navigation
  window.menuItems = [
    { title: 'Home', url: './index.html' },
    { title: 'Digital Signature Creator', url: './create_signature.html' },
    { title: 'Voting Rights Cash Out', url: './withdraw_voting_rights.html' },
    { title: 'Verify Signed Request', url: './verify_request.html' },
    { title: 'Cacao Bag Scanner', url: './scanner.html' },
    { title: 'Sales Reporter', url: './report_sales.html' },
    { title: 'Inventory Expense Reporter', url: './report_dao_expenses.html' },
    { title: 'Inventory Movement Reporter', url: './report_inventory_movement.html' },
    { title: 'Register Your Farm', url: './register_farm.html' },
    { title: 'Report Tree Planting', url: './report_tree_planting.html' },
    { title: 'Notarize Supply Chain Document', url: './notarize.html' },
    { title: 'DAO Contribution Reporter', url: './report_contribution.html' }
  ];

  // Render dropdown menu if placeholder is present
  document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('navDropdown');
    if (!container) return;
    var select = document.createElement('select');
    // Basic styling
    select.style.padding = '0.5rem';
    select.style.fontSize = '1rem';
    select.style.marginBottom = '1rem';
    // Populate options
    // Determine current page filename
    var currentPage = location.pathname.split('/').pop();
    window.menuItems.forEach(function(item) {
      var option = document.createElement('option');
      option.value = item.url;
      option.textContent = item.title;
      // Select the option matching the current page
      var itemPage = item.url.split('/').pop();
      if (currentPage === itemPage) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    // Navigate on change
    select.addEventListener('change', function() {
      location.href = this.value;
    });
    container.appendChild(select);
  });
})();