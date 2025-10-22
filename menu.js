// navigation menu shared across all individual pages
(function() {
  // List of pages for navigation, grouped by section matching index.html
  window.menuItems = [
    { title: 'Home', url: './index.html', section: '' },
    { title: 'DAO Contribution Reporter', url: './report_contribution.html', section: 'Community Contributions' },
    { title: 'Capital Injection Reporter', url: './report_capital_injection.html', section: 'Community Contributions' },
    { title: 'Content Feedback Submission', url: './submit_feedback.html', section: 'Community Contributions' },
    { title: 'Inventory Expense Reporter', url: './report_dao_expenses.html', section: 'Inventory & Sales' },
    { title: 'Inventory Movement Reporter', url: './report_inventory_movement.html', section: 'Inventory & Sales' },
    { title: 'Report Tree Planting', url: './report_tree_planting.html', section: 'Sunmint Tree Planting Program' },
    { title: 'Digital Signature Creator', url: './create_signature.html', section: 'Identity & Governance' },
    { title: 'Voting Rights Cash Out', url: './withdraw_voting_rights.html', section: 'Identity & Governance' },
    { title: 'Notarize Official Document', url: './notarize.html', section: 'Identity & Governance' },
    { title: 'Verify Signed Request', url: './verify_request.html', section: 'Identity & Governance' },
    { title: 'DAO Proposal Management', url: './view_open_proposals.html', section: 'Identity & Governance' },
    { title: 'Cacao Bag Scanner', url: './scanner.html', section: 'Inventory & Sales' },
    { title: 'Sales Reporter', url: './report_sales.html', section: 'Inventory & Sales' },
    { title: 'Batch QR Code Generator', url: './batch_qr_generator.html', section: 'Inventory & Sales' },
    { title: 'Register Your Farm', url: './register_farm.html', section: 'Sunmint Tree Planting Program' }
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
    // Populate options grouped by section
    var currentPage = location.pathname.split('/').pop();
    var sectionsMap = {};
    var sectionOrder = [];
    window.menuItems.forEach(function(item) {
      var sec = item.section || '';
      if (!sectionsMap.hasOwnProperty(sec)) {
        sectionsMap[sec] = [];
        sectionOrder.push(sec);
      }
      sectionsMap[sec].push(item);
    });
    sectionOrder.forEach(function(sec) {
      var parent = select;
      if (sec) {
        var optgroup = document.createElement('optgroup');
        optgroup.label = sec;
        select.appendChild(optgroup);
        parent = optgroup;
      }
      sectionsMap[sec].forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.url;
        option.textContent = item.title;
        var itemPage = item.url.split('/').pop();
        
        // Special handling for proposal pages
        var isProposalPage = currentPage === 'review_proposal.html' || currentPage === 'create_proposal.html';
        var isDAOProposalManagement = item.title === 'DAO Proposal Management';
        
        if (currentPage === itemPage || (isProposalPage && isDAOProposalManagement)) {
          option.selected = true;
        }
        parent.appendChild(option);
      });
    });
    // Navigate on change
    select.addEventListener('change', function() {
      location.href = this.value;
    });
    container.appendChild(select);
  });
})();