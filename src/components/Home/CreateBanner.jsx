import createEvent from '../../assets/images/createEvent.png'
import { NavLink } from "react-router-dom";

const CreateBanner = () => {
  return (
    <section style={{ position: "relative", textAlign: "center" }}>
      <img src={createEvent} alt="" width="90%" />
      <div className="create-event">
        <p>Got a show, event, activity or a great experience? Partner with us & get listed on Eventify.</p>
        <NavLink
          to="/CreateEvent">
          <button className="create-btn-alt">Create Event</button>
        </NavLink>
      </div>
    </section>
  )
}

export default CreateBanner