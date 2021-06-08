
(function mounted() {
    getTableData()
    $('#date').datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: '1900:2200',
      dateFormat: 'dd-mm-yy'
    })
    $('#edit_date').datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: '1900:2200',
      dateFormat: 'dd-mm-yy'
    })
  })()

//Generating unique ID for new Input

  function guid() {
    return parseInt(Date.now() + Math.random())
  }

//Create and Store New Member

  var el = document.querySelector('#saveMemberInfo');
  if (el) {
      el.addEventListener('submit', saveMemberInfo);
  }
  function saveMemberInfo(event) {
    event.preventDefault();
    const keys = ['registrationno', 'name', 'email', 'date', 'time', 'slotno']
    const obj = {}
    keys.forEach((item, index) => {
      const result = document.getElementById(item).value
      if (result) {
        obj[item] = result;
      }
    })
    var members = getMembers()
    members.forEach((item) => {
      if (obj.slotno === item.slotno) {
        if (obj.date === item.date) {
          if (obj.time === item.time) {
          alert("Can't allocate slotno. slotno is not availabe on the selected day and time.");
          window.location.reload();
          this.preventDefault();
          return false;
        }
      }
    }
  })
    if (!members.length) {
      $('.show-table-info').addClass('hide')
    }
    if (Object.keys(obj).length) {
      var members = getMembers()
      obj.id = guid()
      members.push(obj)
      const data = JSON.stringify(members)
      localStorage.setItem('members', data)
      el.reset()
      insertIntoTableView(obj, getTotalRowOfTable())
      $('#addnewModal').modal('hide')
    }
  }

// Clear Create New Member Form Data

  function clearFields() {
    $('#input_form')[0].reset()
  }
//Get All Members already stored into the local storage

  function getMembers() {
    const memberRecord = localStorage.getItem('members')
    let members = []
    if (!memberRecord) {
      return members
    } else {
      members = JSON.parse(memberRecord)
      return members
    }
  }
  //Populating Table with stored data
   
  // function getTableData() {
  //   $('#member_table').find('tr:not(:first)').remove()
  //   const searchKeyword = $('#member_search').val()
  //   const members = getMembers()
  //   const filteredMembers = members.filter(({
  //       registrationno,
  //       name,
  //       email,
  //       date,
  //       time,
  //       slotno
  //     }, index) => registrationno.toLowerCase().includes(searchKeyword.toLowerCase()) ||
  //     name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
  //     email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
  //     date.toLowerCase().includes(searchKeyword.toLowerCase()) ||
  //     time.toLowerCase().includes(searchKeyword.toLowerCase()) ||
  //     slotno.toLowerCase().includes(searchKeyword.toLowerCase()))
  //   if (!filteredMembers.length) {
  //     $('.show-table-info').removeClass('hide')
  //   } else {
  //     $('.show-table-info').addClass('hide')
  //   }
  //   filteredMembers.forEach((item, index) => {
  //     insertIntoTableView(item, index + 1)
  //   })
  // }
  /**
   * Inserting data into the table of the view
   *
   * @param {object} item
   * @param {int} tableIndex
   */
  function insertIntoTableView(item, tableIndex) {
    const table = document.getElementById('member_table')
    const row = table.insertRow()
    const idCell = row.insertCell(0)
    const firstNameCell = row.insertCell(1)
    const lastNameCell = row.insertCell(2)
    const emailCell = row.insertCell(3)
    const dateOfAllocationCell = row.insertCell(4)
    const timeOfAllocationCell = row.insertCell(4)
    const slotnoCell = row.insertCell(6)
    const actionCell = row.insertCell(7)
    idCell.innerHTML = tableIndex
    firstNameCell.innerHTML = item.registrationno
    lastNameCell.innerHTML = item.name
    emailCell.innerHTML = item.email
    dateOfAllocationCell.innerHTML = item.date
    timeOfAllocationCell.innerHTML = item.time
    slotnoCell.innerHTML = `<span class="tag">${item.slotno}</span>`
    const guid = item.id
    actionCell.innerHTML = `<button class="btn btn-sm btn-secondary" onclick="showMemberData(${guid})">View</button> <button class="btn btn-sm btn-primary" onclick="showEditModal(${guid})">Edit</button> <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${guid})">Delete</button>`
  }

//Get Total Row of Table

  function getTotalRowOfTable() {
    const table = document.getElementById('member_table')
    return table.rows.length
  }
  /**
   * Show Single Member Data into the modal
   *
   * @param {string} id
   */
  function showMemberData(id) {
    const allMembers = getMembers()
    const member = allMembers.find(item => item.id == id)
    $('#show_registrationno').val(member.registrationno)
    $('#show_name').val(member.name)
    $('#show_email').val(member.email)
    $('#show_date').val(member.date)
    $('#show_time').val(member.time)
    $('#show_slotno').val(member.slotno)
    $('#showModal').modal()
  }
  /**
   * Show Edit Modal of a single member
   *
   * @param {string} id
   */
  function showEditModal(id) {
    const allMembers = getMembers()
    const member = allMembers.find(item => item.id == id)
    $('#edit_registrationno').val(member.registrationno)
    $('#edit_name').val(member.name)
    $('#edit_email').val(member.email)
    $('#edit_date').val(member.date)
    $('#edit_time').val(member.time)
    $('#edit_slotno').val(member.slotno)
    $('#member_id').val(id)
    $('#editModal').modal()
  }

//Store Updated Member Data into the storage

  function updateMemberData() {
    if ($('#edit_registrationno').val() == '' || $('#edit_name').val() == '' || $('#edit_email').val() == '' || $('#edit_date').val() == '' || $('#edit_time').val() == '' || $('#edit_slotno').val() == '') {
      alert("All fields are required");
      window.location.reload();
      this.preventDefault();
      return false;
    }
    var members = getMembers()
    members.forEach((item) => {
      if ($('#edit_slotno').val() === item.slotno) {
        if ($('#edit_date').val() === item.date) {
          alert("Can't allocate slotno. slotno is not availabe on the selected day.");
          window.location.reload();
          this.preventDefault();
          return false;
        }
      }
    })
    const allMembers = getMembers()
    const memberId = $('#member_id').val()
    const member = allMembers.find(({
      id
    }) => id == memberId)
    member.registrationno = $('#edit_registrationno').val()
    member.name = $('#edit_name').val()
    member.email = $('#edit_email').val()
    member.date = $('#edit_date').val()
    member.time = $('#edit_time').val()
    member.slotno = $('#edit_slotno').val()
    const data = JSON.stringify(allMembers)
    localStorage.setItem('members', data)
    $('#member_table').find('tr:not(:first)').remove()
    getTableData()
    $('#editModal').modal('hide')
  }
  /**
   * Show Delete Confirmation Dialog Modal
   *
   * @param {int} id
   */
  function showDeleteModal(id) {
    $('#deleted-member-id').val(id)
    $('#deleteDialog').modal()
  }
  
//Delete single member

  function deleteMemberData() {
    const id = $('#deleted-member-id').val()
    const allMembers = getMembers()
    const storageUsers = JSON.parse(localStorage.getItem('members'))
    let newData = []
    newData = storageUsers.filter((item, index) => item.id != id)
    const data = JSON.stringify(newData)
    localStorage.setItem('members', data)
    $('#member_table').find('tr:not(:first)').remove()
    $('#deleteDialog').modal('hide')
    getTableData()
  }
  /**
   * Sorting table data through type, e.g: registrationno, email, name etc.
   *
   * @param {string} type
   */
  function sortBy(type) {
    $("#member_table").find("tr:not(:first)").remove();
    var totalClickOfType = parseInt(localStorage.getItem(type));
    if (!totalClickOfType) {
      totalClickOfType = 1;
      localStorage.setItem(type, totalClickOfType);
    } else {
      if (totalClickOfType == 1) {
        totalClickOfType = 2;
      } else {
        totalClickOfType = 1;
      }
      localStorage.setItem(type, totalClickOfType);
    }
    var searchKeyword = $('#member_search').val();
    var members = getMembers();
    var sortedMembers = members.sort(function (a, b) {
      return (totalClickOfType == 2) ? a[type] > b[type] : a[type] < b[type];
    });
    sortedMembers.forEach(function (item, index) {
      insertIntoTableView(item, index + 1);
    })
  }
  