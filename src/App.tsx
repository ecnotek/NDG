import { useMemo, useState } from "react";

type View = "Dashboard" | "Members" | "Fees & Payments" | "Attendance" | "Reports" | "More";

const members = [
  { id: "NDG-0241", name: "Aarav Sharma", batch: "Hip-Hop Juniors", phone: "9841 223 810", due: 2500, status: "Overdue", initials: "AS" },
  { id: "NDG-0238", name: "Saanvi Karki", batch: "Contemporary A", phone: "9804 510 334", due: 1500, status: "Due", initials: "SK" },
  { id: "NDG-0219", name: "Riya Thapa", batch: "Bollywood Teens", phone: "9815 770 124", due: 0, status: "Paid", initials: "RT" },
  { id: "NDG-0187", name: "Nischal Rai", batch: "Hip-Hop Advanced", phone: "9862 190 871", due: 0, status: "Paid", initials: "NR" },
];

const nav: { label: View; icon: string }[] = [
  { label: "Dashboard", icon: "⌂" },
  { label: "Members", icon: "◉" },
  { label: "Fees & Payments", icon: "₨" },
  { label: "Attendance", icon: "✓" },
  { label: "Reports", icon: "▥" },
  { label: "More", icon: "•••" },
];

function Button({ children, variant = "primary", onClick, className = "", disabled = false }: any) {
  return <button disabled={disabled} onClick={onClick} className={`btn btn-${variant} ${className}`}>{children}</button>;
}
function Badge({ children, tone = "neutral" }: any) { return <span className={`badge ${tone.toLowerCase()}`}>{children}</span>; }
function Avatar({ initials, big = false }: { initials: string; big?: boolean }) { return <span className={`avatar ${big ? "big" : ""}`}>{initials}</span>; }

export default function App() {
  const [view, setView] = useState<View>("Dashboard");
  const [modal, setModal] = useState<"member" | "payment" | "receipt" | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [attendance, setAttendance] = useState<Record<string, string>>({ "Aarav Sharma": "Present", "Saanvi Karki": "Present" });

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const filtered = useMemo(() => members.filter(m => `${m.name} ${m.phone} ${m.id}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><img className="brand-mark" src="/ndg-logo.jpg" alt="The Gang of Moves Dance & Fitness Studio" /><div><strong>NDG</strong><small>Dance Academy</small></div></div>
        <div className="role"><span>BA</span><div><strong>Biratnagar</strong><small>Branch Manager</small></div><b>⌄</b></div>
        <nav>{nav.map(n => <button key={n.label} className={view === n.label ? "active" : ""} onClick={() => setView(n.label)}><i>{n.icon}</i>{n.label}{n.label === "More" && <span className="nav-dot" />}</button>)}</nav>
        <div className="sidebar-bottom"><button onClick={() => setView("More")}>⚙ <span>Settings</span></button><div className="user"><Avatar initials="RK" /><div><strong>Rajan Karki</strong><small>Super Admin</small></div><b>⌄</b></div></div>
      </aside>

      <main>
        <header>
          <div className="mobile-brand"><img className="brand-mark" src="/ndg-logo.jpg" alt="The Gang of Moves Dance & Fitness Studio" /><strong>NDG</strong></div>
          <label className="global-search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search members, payments..." /><kbd>⌘ K</kbd></label>
          <div className="header-actions"><button className="branch">Biratnagar Branch⌄</button><button className="bell">♢<span /></button><Avatar initials="RK" /></div>
        </header>

        <div className="content">
          {view === "Dashboard" && <Dashboard setModal={setModal} setView={setView} />}
          {view === "Members" && <Members query={query} setQuery={setQuery} rows={filtered} setModal={setModal} />}
          {view === "Fees & Payments" && <Fees setModal={setModal} />}
          {view === "Attendance" && <Attendance attendance={attendance} setAttendance={setAttendance} notify={notify} />}
          {view === "Reports" && <Reports />}
          {view === "More" && <More />}
        </div>
      </main>

      <div className="mobile-nav">{nav.slice(0, 5).map(n => <button key={n.label} className={view === n.label ? "active" : ""} onClick={() => setView(n.label)}><i>{n.icon}</i><span>{n.label === "Fees & Payments" ? "Fees" : n.label}</span></button>)}</div>
      {modal && <WorkflowModal type={modal} close={() => setModal(null)} next={(m: any) => setModal(m)} notify={notify} />}
      {toast && <div className="toast"><b>✓</b>{toast}</div>}
    </div>
  );
}

function PageHead({ eyebrow, title, subtitle, action, className = "" }: any) {
  return <div className={`page-head ${className}`}><div><small>{eyebrow}</small><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function Dashboard({ setModal, setView }: any) {
  return <>
    <PageHead className="dashboard-page-head" eyebrow="SATURDAY, 14 JUNE" title="Namaste, Rajan" subtitle="Here’s what’s happening at NDG today." action={<Button onClick={() => setModal("member")}>＋ Add new member</Button>} />
    <div className="quick-actions"><Button onClick={() => setModal("member")}>＋ Add member</Button><Button variant="soft" onClick={() => setModal("payment")}>₨ Collect fee</Button><Button variant="soft" onClick={() => setView("Attendance")}>✓ Mark attendance</Button></div>
    <section className="pulse-strip">
      <div className="pulse-copy"><span className="live-pulse"><i /> TODAY’S PULSE</span><h2>The studio is moving.</h2><p>3 classes completed, 84 check-ins and NPR 18,500 collected so far.</p></div>
      <div className="pulse-progress"><div className="progress-ring"><strong>78%</strong><small>attendance</small></div><div className="pulse-bars"><span><i /></span><small>Daily goal · NPR 18,500 / 25,000</small></div></div>
      <div className="pulse-actions"><button onClick={() => setModal("payment")}><b>₨</b><span>Collect fee<small>Fast payment</small></span><i>→</i></button><button onClick={() => setView("Attendance")}><b>✓</b><span>Attendance<small>5 classes left</small></span><i>→</i></button></div>
    </section>
    <div className="stats-grid">
      <Stat icon="◉" label="Total members" value="248" note="+12 this month" tone="blue" />
      <Stat icon="✓" label="Active members" value="231" note="17 inactive" tone="green" />
      <Stat icon="▣" label="Today's classes" value="8" note="3 completed" tone="purple" />
      <Stat icon="₨" label="Fees overdue" value="NPR 38,500" note="21 members" tone="red" />
      <Stat icon="↗" label="Monthly revenue" value="NPR 284,000" note="+8.4% from May" tone="gold" />
    </div>
    <div className="dashboard-grid">
      <section className="card classes-card"><CardTitle title="Today’s classes" meta="8 classes" action="View timetable" />
        {[["Hip-Hop Juniors","07:00 – 08:00 AM","Rohan Shrestha","12 / 18","live"],["Zumba Morning","08:15 – 09:15 AM","Priya Rai","19 / 22","next"],["Contemporary A","04:00 – 05:00 PM","Nima Lama","14 / 16",""],["Bollywood Teens","05:15 – 06:15 PM","Anisha Karki","16 / 20",""]].map((c,i)=><div className="class-row" key={c[0]}><div className={`time-line c${i}`} /><div className="class-main"><strong>{c[0]}</strong><small>{c[1]} · Studio {i%2+1}</small></div><div className="instructor"><Avatar initials={c[2].split(" ").map(x=>x[0]).join("")} /><span>{c[2]}</span></div><span className="capacity">{c[3]}</span>{c[4] ? <Badge tone={c[4] === "live" ? "green" : "amber"}>{c[4] === "live" ? "In progress" : "Up next"}</Badge> : <Badge>Later</Badge>}</div>)}
      </section>
      <section className="card overdue"><CardTitle title="Overdue fees" meta="NPR 38,500 total" action="View all" />
        {members.slice(0,3).map((m,i)=><div className="person-row" key={m.id}><Avatar initials={m.initials}/><div><strong>{m.name}</strong><small>{i===0?"12 days overdue":i===1?"7 days overdue":"4 days overdue"}</small></div><div className="amount"><strong>NPR {i===0?"2,500":i===1?"3,000":"1,500"}</strong><button onClick={() => setModal("payment")}>Collect</button></div></div>)}
        <div className="reminder">◈ <span><strong>Send payment reminders</strong><small>Notify all 21 members via SMS</small></span><button>Send</button></div>
      </section>
    </div>
  </>;
}
function Stat({ icon,label,value,note,tone }:any){return <div className="stat-card"><span className={`stat-icon ${tone}`}>{icon}</span><small>{label}</small><strong>{value}</strong><p className={note.includes("+")?"positive":""}>{note}</p></div>}
function CardTitle({title,meta,action}:any){return <div className="card-title"><div><h2>{title}</h2><small>{meta}</small></div><button>{action} →</button></div>}

function Members({ query,setQuery,rows,setModal }:any){
  return <><PageHead eyebrow="PEOPLE" title="Members" subtitle="Manage profiles, classes and payment status." action={<Button onClick={()=>setModal("member")}>＋ Add member</Button>}/>
    <div className="toolbar"><label><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, phone or ID"/></label><button>All batches ⌄</button><button>Fee status ⌄</button><button>Status: Active ⌄</button></div>
    <section className="card table-card"><div className="table-head"><span>MEMBER</span><span>CONTACT</span><span>BATCH</span><span>FEE STATUS</span><span></span></div>
      {rows.map((m:any)=><div className="member-row" key={m.id}><div className="member-name"><Avatar initials={m.initials}/><div><strong>{m.name}</strong><small>{m.id}</small></div></div><span>{m.phone}</span><span>{m.batch}</span><span><Badge tone={m.status==="Paid"?"green":m.status==="Due"?"amber":"red"}>{m.status}{m.due?` · NPR ${m.due.toLocaleString()}`:""}</Badge></span><button>•••</button></div>)}
    </section></>
}

function Fees({setModal}:any){return <><PageHead eyebrow="MONEY" title="Fees & payments" subtitle="Track collections, dues and receipts in one place." action={<Button onClick={()=>setModal("payment")}>₨ Collect payment</Button>}/>
  <div className="stats-grid fee-stats"><Stat icon="₨" label="Collected this month" value="NPR 284,000" note="+8.4% from May" tone="green"/><Stat icon="!" label="Pending dues" value="NPR 67,500" note="43 members" tone="gold"/><Stat icon="×" label="Overdue" value="NPR 38,500" note="21 members" tone="red"/></div>
  <section className="card table-card"><CardTitle title="Recent payments" meta="June 2025" action="Export"/>{members.map((m,i)=><div className="member-row payment-row" key={m.id}><div className="member-name"><Avatar initials={m.initials}/><div><strong>{m.name}</strong><small>{m.id} · Cash</small></div></div><span>{["14 Jun, 10:42 AM","14 Jun, 09:15 AM","13 Jun, 05:20 PM","13 Jun, 03:12 PM"][i]}</span><span>Monthly fee · June</span><strong>NPR {["1,500","2,000","1,500","2,500"][i]}</strong><Badge tone="green">Paid</Badge></div>)}</section></>}

function Attendance({attendance,setAttendance,notify}:any){
 const list=["Aarav Sharma","Saanvi Karki","Riya Thapa","Nischal Rai","Prisha Gautam","Aayush Mandal"];
 const present=Object.values(attendance).filter(x=>x==="Present").length;
 return <div className="attendance-page"><PageHead eyebrow="ATTENDANCE" title="Today’s class" subtitle="Mark everyone in a few taps." action={<Button onClick={()=>notify("Attendance saved")}>Save attendance</Button>}/>
 <div className="attendance-controls">
   <button><small>BATCH</small><strong>Hip-Hop Juniors</strong><span>⌄</span></button>
   <button><small>DATE</small><strong>14 June 2025</strong><span>⌄</span></button>
 </div>
 <div className="checkin-bar">
   <div><strong>{Object.keys(attendance).length} of {list.length} marked</strong><div className="checkin-track"><i style={{width:`${Object.keys(attendance).length/list.length*100}%`}} /></div></div>
   <span className="summary present-summary">{present} Present</span>
   <span className="summary absent-summary">{Object.values(attendance).filter(x=>x==="Absent").length} Absent</span>
   <button onClick={()=>setAttendance(Object.fromEntries(list.map(name=>[name,"Present"])))}>✓ Mark all present</button>
 </div>
 <section className="attendance-board">{list.map((name)=><article className={`checkin-card ${attendance[name]?.toLowerCase()||"unmarked"}`} key={name}><div className="checkin-person"><Avatar initials={name.split(" ").map(x=>x[0]).join("")}/><div><strong>{name}</strong><small>{attendance[name] || "Not marked"}</small></div></div><div className="checkin-actions">{["Present","Absent","Leave"].map(s=><button aria-label={`${name} ${s}`} title={s} className={attendance[name]===s?s.toLowerCase():""} onClick={()=>setAttendance({...attendance,[name]:s})} key={s}><i>{s==="Present"?"✓":s==="Absent"?"×":"−"}</i><span>{s}</span></button>)}</div></article>)}</section>
 <div className="attendance-save"><div><strong>{Object.keys(attendance).length} of {list.length} marked</strong><span>{list.length-Object.keys(attendance).length} remaining</span></div><Button onClick={()=>notify("Attendance saved")}>Save attendance</Button></div></div>
}

function Reports(){return <><PageHead eyebrow="INSIGHTS" title="Reports" subtitle="Clear summaries for your academy." action={<div className="head-actions"><Button variant="soft">Export Excel</Button><Button>Download PDF</Button></div>}/><div className="report-filters"><button>This month⌄</button><button>All batches⌄</button><button>Biratnagar⌄</button></div><div className="stats-grid"><Stat icon="↗" label="Total income" value="NPR 284,000" note="+8.4% vs May" tone="green"/><Stat icon="↘" label="Expenses" value="NPR 126,500" note="44.5% of income" tone="red"/><Stat icon="=" label="Net profit" value="NPR 157,500" note="+12.1% vs May" tone="gold"/></div><section className="card chart"><CardTitle title="Income & expenses" meta="Last 6 months" action="View details"/><div className="bars">{[48,66,58,79,72,92].map((h,i)=><div className="bar-group" key={i}><div className="bar income" style={{height:`${h}%`}}/><div className="bar expense" style={{height:`${h/2}%`}}/><span>{["Jan","Feb","Mar","Apr","May","Jun"][i]}</span></div>)}</div></section></>}

function More(){return <><PageHead eyebrow="MANAGE" title="Academy settings" subtitle="Staff, communication and administration."/><div className="module-grid">{[["Classes & batches","Weekly timetable, instructors and members","Active"],["Staff & instructors","Profiles, schedules and assigned batches","8 staff"],["Notifications","SMS, WhatsApp and message templates","12 sent"],["Expenses","Rent, salary, equipment and profit/loss","Manager only"],["Roles & permissions","User access and permission matrix","4 roles"],["Branch management","Locations, settings and branch switcher","1 branch"],["Audit & backup","Activity log, backups and data export","Healthy"],["Online payments","eSewa, Khalti and QR payments","Coming soon"],["Member mobile app","Self-service profiles and schedules","Coming soon"]].map(x=><article className="card module" key={x[0]}><span>◇</span><div><h3>{x[0]}</h3><p>{x[1]}</p></div><Badge tone={x[2]==="Coming soon"?"amber":"neutral"}>{x[2]}</Badge></article>)}</div></>}

function WorkflowModal({type,close,next,notify}:any){
 const [step,setStep]=useState(1);
 if(type==="receipt") return <div className="modal-wrap"><div className="modal receipt"><button className="close" onClick={close}>×</button><div className="receipt-brand"><img className="brand-mark" src="/ndg-logo.jpg" alt="The Gang of Moves Dance & Fitness Studio" /><h2>Payment received</h2><p>Receipt #NDG-250614-041</p></div><div className="paid-stamp">PAID</div><div className="receipt-row"><span>Received from</span><strong>Aarav Sharma</strong></div><div className="receipt-row"><span>For</span><strong>Monthly fee · June 2025</strong></div><div className="receipt-row"><span>Payment method</span><strong>Cash</strong></div><div className="receipt-total"><span>Total paid</span><strong>NPR 2,500</strong></div><div className="modal-actions"><Button variant="soft" onClick={()=>notify("Receipt sent to 9841 223 810")}>Send receipt</Button><Button onClick={()=>window.print()}>Print receipt</Button></div></div></div>
 return <div className="modal-wrap"><div className="modal"><button className="close" onClick={close}>×</button>{type==="member"?<><div className="modal-title"><span>01</span><div><h2>Add new member</h2><p>Basic details · You can add more later</p></div></div><div className="form-grid"><label className="wide">Full name<input autoFocus placeholder="e.g. Ananya Rai"/></label><label>Phone number<input placeholder="98XX XXX XXX"/></label><label>Date of birth<input type="date"/></label><label>Gender<select><option>Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></label><label>Join date<input type="date" defaultValue="2025-06-14"/></label><label className="wide">Class / batch<select><option>Select a batch</option><option>Hip-Hop Juniors</option><option>Contemporary A</option><option>Bollywood Teens</option></select></label></div><div className="modal-note">Member ID will be generated automatically.</div><div className="modal-actions"><Button variant="ghost" onClick={close}>Cancel</Button><Button onClick={()=>{notify("Member added successfully");close()}}>Add member</Button></div></>:<><div className="modal-title"><span>₨</span><div><h2>Collect payment</h2><p>Fast collection · Step {step} of 2</p></div></div>{step===1?<><label className="search-member">Find member<input autoFocus placeholder="Search name, phone or ID" defaultValue="Aarav Sharma"/></label><div className="selected-member"><Avatar initials="AS" big/><div><strong>Aarav Sharma</strong><small>NDG-0241 · Hip-Hop Juniors</small></div><Badge tone="red">NPR 2,500 due</Badge></div><div className="due-box"><div><span>June monthly fee</span><small>Due 5 June 2025</small></div><strong>NPR 2,500</strong></div><div className="modal-actions"><Button variant="ghost" onClick={close}>Cancel</Button><Button onClick={()=>setStep(2)}>Continue →</Button></div></>:<><div className="amount-input"><span>NPR</span><input autoFocus defaultValue="2,500"/></div><label>Payment method<div className="payment-methods">{["Cash","Bank","QR","Online"].map((x,i)=><button className={i===0?"selected":""} key={x}>{x}</button>)}</div></label><label>Payment date<input type="date" defaultValue="2025-06-14"/></label><div className="modal-actions"><Button variant="ghost" onClick={()=>setStep(1)}>← Back</Button><Button onClick={()=>next("receipt")}>Confirm NPR 2,500</Button></div></>}</>}</div></div>
}
