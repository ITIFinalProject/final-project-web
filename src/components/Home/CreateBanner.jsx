import createEvent from '../../assets/images/createEvent.png'
const CreateBanner = () => {
  return (
    <section style={{position: "relative",textAlign: "center"}}>
        <img src={createEvent} alt="" width="90%"/>
        <div class="create-event">
            <p>Got a show, event, activity or a great experience? Partner with us & get listed on Eventify.</p>
            <button class="create-btn-alt">Create Event</button>
        </div>
    </section>
  )
}

export default CreateBanner