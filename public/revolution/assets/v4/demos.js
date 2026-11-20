const element = (id) => document.getElementById(id);

function setupBoard() {
  const columns = ['Queued', 'In progress', 'Done'];
  const initialCards = [
    { id: 'mapping', title: 'Check campaign mapping', owner: 'Data reviewer', due: 'Today', status: 'Queued' },
    { id: 'report', title: 'Prepare the weekly report', owner: 'Growth analyst', due: 'Tomorrow', status: 'Queued' },
    { id: 'call', title: 'Review a lead handoff', owner: 'Sales owner', due: 'Today', status: 'In progress' },
    { id: 'brief', title: 'Draft the experiment brief', owner: 'Growth lead', due: 'Next week', status: 'In progress' },
    { id: 'tags', title: 'Check form events', owner: 'Web editor', due: 'Yesterday', status: 'Done' }
  ];
  let cards = initialCards.map((card) => ({ ...card }));
  const dueOnly = element('due-only');
  const notice = element('notice');

  function renderCards() {
    const visible = dueOnly.checked ? cards.filter((card) => card.due === 'Today' && card.status !== 'Done') : cards;
    columns.forEach((status, index) => {
      const list = element(`column-${index}`);
      const column = visible.filter((card) => card.status === status);
      list.innerHTML = column.map((card) => `<li class="task">
        <strong>${card.title}</strong><p class="helper">${card.owner}</p>
        <p class="helper ${card.due === 'Today' && card.status !== 'Done' ? 'badge-warn' : ''}">${card.due}</p>
        <select id="task-${card.id}" data-card="${card.id}" aria-label="Status for ${card.title}">
          ${columns.map((value) => `<option${value === status ? ' selected' : ''}>${value}</option>`).join('')}
        </select></li>`).join('');
      if (!column.length) list.innerHTML = '<li class="helper">No visible tasks.</li>';
    });
    element('visible-count').textContent = `${visible.length} of ${cards.length} tasks shown`;
  }

  element('task-board').addEventListener('change', (event) => {
    if (!event.target.matches('select[data-card]')) return;
    const card = cards.find((item) => item.id === event.target.dataset.card);
    card.status = event.target.value;
    renderCards();
    (element(`task-${card.id}`) || dueOnly).focus();
    notice.textContent = `${card.title} moved to ${card.status}.`;
  });
  dueOnly.addEventListener('change', renderCards);
  element('reset-board').addEventListener('click', () => {
    cards = initialCards.map((card) => ({ ...card }));
    dueOnly.checked = false;
    renderCards();
    notice.textContent = 'The board was reset.';
  });
  renderCards();
}

function setupDashboard() {
  const records = [
    { segment: 'Workspaces', spend: 420, leads: 21 },
    { segment: 'Field teams', spend: 600, leads: 24 },
    { segment: 'Studios', spend: 280, leads: 14 }
  ];
  const chooseSegment = element('segment');
  const lateFeed = element('late-feed');
  const decimal = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });

  function renderSnapshot() {
    const selection = chooseSegment.value;
    const rows = selection === 'all' ? records : records.filter((row) => row.segment === selection);
    const spend = rows.reduce((total, row) => total + row.spend, 0);
    const leads = rows.reduce((total, row) => total + row.leads, 0);
    element('spend').textContent = `${decimal.format(spend)} units`;
    element('leads').textContent = lateFeed.checked ? 'Pending' : leads;
    element('cpl').textContent = lateFeed.checked ? 'Pending' : `${decimal.format(spend / leads)} units`;
    element('snapshot-note').textContent = lateFeed.checked
      ? 'Lead data is delayed. Spend is current and the cost-per-lead ratio is waiting for matching lead data.'
      : 'Campaign spend and lead data cover the same example period.';
    element('source-leads').textContent = lateFeed.checked ? 'Delayed' : 'Current';
    element('source-leads').classList.toggle('badge-warn', lateFeed.checked);
    element('segment-data').innerHTML = rows.map(({ segment, spend: value }) => `<li>
      <span>${segment}</span><progress aria-label="${segment} spend" value="${value}" max="600"></progress><strong>${value}</strong></li>`).join('');
  }

  chooseSegment.addEventListener('change', renderSnapshot);
  lateFeed.addEventListener('change', renderSnapshot);
  renderSnapshot();
}

function setupAgent() {
  const examples = {
    'guided-trial': {
      request: 'We want to try a shared workflow with our support team. Can we start next month?',
      facts: 'The buyer wants a trial for a support workflow and named next month as a desired start.',
      missing: 'Team size and the trial success criteria.',
      reply: 'What is the size of the trial group, and what would a successful first month look like?'
    },
    'integration-review': {
      request: 'We are looking at bringing two internal systems together. Do you have an integration guide?',
      facts: 'The buyer asked for integration guidance and would like to connect two internal systems.',
      missing: 'System types, ownership and evaluation timeline.',
      reply: 'Which types of systems do you need to connect, and who will help evaluate the integration?'
    }
  };
  const scenario = element('scenario');
  const draft = element('reply');
  const approve = element('approve');
  const approved = element('approved');
  const notice = element('approval-note');

  function clearApproval() {
    approved.hidden = true;
    approved.textContent = '';
    approve.disabled = !draft.value.trim();
    notice.textContent = 'Ready for review.';
  }

  function loadScenario() {
    const example = examples[scenario.value];
    element('enquiry').textContent = example.request;
    element('facts').textContent = example.facts;
    element('missing').textContent = example.missing;
    draft.value = example.reply;
    clearApproval();
  }

  draft.addEventListener('input', clearApproval);
  scenario.addEventListener('change', loadScenario);
  approve.addEventListener('click', () => {
    approved.textContent = draft.value.trim();
    approved.hidden = false;
    notice.textContent = 'This version is approved for the demonstration handoff.';
    approve.disabled = true;
  });
  loadScenario();
}

const setup = { board: setupBoard, dashboard: setupDashboard, agent: setupAgent };
setup[document.body.dataset.demo]?.();
