import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Pusher from 'pusher-js';

const ScheduleEmailForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState(new Date());
  const [template, setTemplate] = useState('reminderEmail'); // Default template or a way to select a template

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    // Add any other configuration options here
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { email, name };
    const formattedSchedule = `${schedule.getMinutes()} ${schedule.getHours()} * * *`;

    try {
      // Simulate the process of scheduling the email
      await scheduleEmail(formattedSchedule, user, template);

      // Trigger Pusher event to notify backend of new email schedule
      pusher.trigger('email-schedule', 'new-email', {
        user,
        schedule: formattedSchedule,
        template,
      });

      alert('Email scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling email:', error);
      alert('Failed to schedule email.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="schedule">Schedule:</label>
        <DatePicker
          selected={schedule}
          onChange={(date) => setSchedule(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          timeCaption="Time"
        />
      </div>
      <button type="submit">Schedule Email</button>
    </form>
  );
};

export default ScheduleEmailForm;
