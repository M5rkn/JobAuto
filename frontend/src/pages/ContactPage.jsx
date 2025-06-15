import React from 'react';
import styles from './ContactPage.module.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className={styles.contactPage}>
      <div className={styles.header}>
        <h1>Свяжитесь с нами</h1>
        <p>Мы всегда готовы ответить на ваши вопросы. Выберите удобный для вас способ связи.</p>
      </div>
      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <h2>Контактная информация</h2>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt className={styles.icon} />
            <div>
              <h3>Адрес</h3>
              <p>полевой проезд 19, Москва, Россия</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaPhone className={styles.icon} />
            <div>
              <h3>Телефон</h3>
              <p>+7 (495) 123-45-67</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaEnvelope className={styles.icon} />
            <div>
              <h3>Email</h3>
              <p>support@carloft.com</p>
            </div>
          </div>
        </div>
        <div className={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.742416803732!2d37.5312158159313!3d55.76292398055694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b549b824367c8b%3A0x46d88f6158017f85!2z0JzQkNCb0JjQkNCfLCDQnNC-0YDQutC90LA!5e0!3m2!1sru!2sru!4v1620301384852!5m2!1sru!2sru"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Location Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 