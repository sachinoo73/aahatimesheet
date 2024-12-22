import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/calendar.events.readonly',
  });

  useEffect(() => {
    if (accessToken) {
      fetchEvents();
    }
  }, [accessToken]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
          },
        }
      );

      const calendarEvents = response.data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Calendar</h2>
        {!accessToken && (
          <button
            onClick={() => login()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Connect Google Calendar
          </button>
        )}
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
      />
    </div>
  );
};

export default Calendar;