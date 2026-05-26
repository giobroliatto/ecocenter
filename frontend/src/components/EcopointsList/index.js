import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import s from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTimes, faPen, faMagnifyingGlass, faSpinner, faXmark, faWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import Utils from '../Utils/utils';

Modal.setAppElement('#root');

const EcopointsList = () => {
    const [ecopoints, setEcopoints] = useState([]);
    const [selectedResidues, setSelectedResidues] = useState([]);
    const [residueTypes, setResidueTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSchedules, setCurrentSchedules] = useState([]);
    const [aiQuery, setAiQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const aiInputRef = useRef(null);
    const navigate = useNavigate();

    const handleEditClick = (id) => {
        navigate(`/edit-ecopoint/${id}`);
    };

    useEffect(() => {
        axios.get('http://localhost:3001/ecopoints?validated=true')
            .then((response) => {
                const ecopoints = response.data; 
                setEcopoints(ecopoints);

                const types = Array.from(new Set(ecopoints.flatMap(ecopoint => ecopoint.residues.map(residue => residue.name))));
                setResidueTypes(types);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
            });
    }, []);

    const handleAISearch = async () => {
        const query = aiQuery.trim();
        if (!query) return;
        setAiLoading(true);
        setAiError('');
        try {
            const response = await axios.post('http://localhost:3001/ai/suggest-residues', {
                query,
                residueTypes,
            });
            const matches = response.data.matches;
            if (matches.length === 0) {
                setAiError('Nenhum resíduo encontrado para essa descrição.');
            } else {
                setSelectedResidues(matches);
            }
        } catch (err) {
            setAiError('Erro ao consultar a IA. Tente novamente.');
        } finally {
            setAiLoading(false);
        }
    };

    const clearAI = () => {
        setAiQuery('');
        setAiError('');
        setSelectedResidues([]);
        if (aiInputRef.current) aiInputRef.current.focus();
    };

    const toggleResidue = (residue) => {
        const isSelected = selectedResidues.includes(residue);
        if (isSelected) {
            setSelectedResidues(selectedResidues.filter(selected => selected !== residue));
        } else {
            setSelectedResidues([...selectedResidues, residue]);
        }
    };

    const filteredEcopoints = ecopoints.filter(
        (ecopoint) =>
            selectedResidues.every(residue => ecopoint.residues.some(ecopointResidue => ecopointResidue.name === residue))
    );

    const openGoogleMaps = (companyStreet, companyNumber, companyDistrict, companyCity) => {
        const street = companyStreet || '';
        const number = companyNumber || '';
        const district = companyDistrict || '';
        const city = companyCity || '';

        const address = `${street} ${number} ${district} ${city}`;

        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(mapsUrl);
    };

    const isOpenNow = (schedules) => {
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const formatTime = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const currentMinutes = formatTime(currentTime);

        return schedules.some(schedule => {
            if (schedule.weekDay !== currentDay) {
                return false;
            }

            const startTime1Minutes = formatTime(schedule.startTime1);
            let endTime1Minutes = formatTime(schedule.endTime1);

            if (endTime1Minutes === 0) {
                endTime1Minutes = 1440;
            }

            if (currentMinutes >= startTime1Minutes && currentMinutes < endTime1Minutes) {
                return true;
            }

            if (schedule.startTime2 && schedule.endTime2) {
                const startTime2Minutes = formatTime(schedule.startTime2);
                let endTime2Minutes = formatTime(schedule.endTime2);

                if (endTime2Minutes === 0) {
                    endTime2Minutes = 1440;
                }

                if (currentMinutes >= startTime2Minutes && currentMinutes < endTime2Minutes) {
                    return true;
                }
            }

            return false;
        });
    };

    const handleClockClick = (schedules) => {
        setCurrentSchedules(schedules);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className={s.content}>
            <h1 className={s.title1}>Ecopontos</h1>
            <div className={s.wrapper_all}>
                <div className={s.wrapper}>
                    <h2 className={s.title2}>Tipos de resíduos</h2>
                    <section className={s.filter_section}>
                        <div className={s.ai_search_wrapper}>
                            <div className={s.ai_search_bar}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} className={s.ai_search_icon} />
                                <input
                                    ref={aiInputRef}
                                    className={s.ai_search_input}
                                    type="text"
                                    placeholder="Descreva o que quer descartar... ex: 'televisão velha' ou 'caixas de papelão'"
                                    value={aiQuery}
                                    onChange={(e) => setAiQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                                />
                                {aiQuery && (
                                    <button className={s.ai_clear_btn} onClick={clearAI} title="Limpar">
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                )}
                                <button
                                    className={s.ai_search_btn}
                                    onClick={handleAISearch}
                                    disabled={aiLoading || !aiQuery.trim()}
                                >
                                    {aiLoading
                                        ? <FontAwesomeIcon icon={faSpinner} spin />
                                        : <><FontAwesomeIcon icon={faWandSparkles} /> Buscar com IA</>}
                                </button>
                            </div>
                            {aiError && <p className={s.ai_error}>{aiError}</p>}
                        </div>
                        <div className={s.tags}>
                            {residueTypes.map((type) => (
                                <div
                                    key={type}
                                    onClick={() => toggleResidue(type)}
                                    className={`${s.tag} ${selectedResidues.includes(type) ? s.tag_selected : ''}`}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className={s.ecopoints_section}>
                        {filteredEcopoints.length === 0 ? (
                            <div className={s.no_ecopoints}>
                                Nenhum ecoponto encontrado
                            </div>
                        ) : (
        filteredEcopoints.map((ecopoint) => {
                                const openNow = isOpenNow(ecopoint.schedules);
                                const userRole = Utils.getRoleFromToken(sessionStorage.getItem('token'));
                                return (
                                    <div className={s.card} key={ecopoint._id}>
                                        {userRole === 'admin' && (
                                            <FontAwesomeIcon 
                                                className={s.pen_icon} 
                                                icon={faPen} 
                                                onClick={() => handleEditClick(ecopoint._id)} 
                                            />
                                        )}
                                        <h3 className={s.title3}>{ecopoint.companyName}</h3>
                                        <div className={s.schedule_section}>
                                            <h4 className={`${s.title4} ${openNow ? s.title4_open : s.title4_closed}`}>
                                                {openNow ? 'Aberto' : 'Fechado'}
                                            </h4>
                                            <FontAwesomeIcon
                                                className={s.clock_icon}
                                                icon={faClock}
                                                onClick={() => handleClockClick(ecopoint.schedules)}
                                            />
                                        </div>
                                        <div className={s.residue_tags}>
                                            {ecopoint.residues.map((residue, index) => (
                                                <div key={index} className={`${s.residue_tag} ${selectedResidues.includes(residue.name) ? s.residue_tag_active : ''}`}>
                                                    {residue.name}
                                                </div>
                                            ))}
                                        </div>
                                        <div className={s.address_wrapper}>
                                            <div className={s.address}>
                                                {ecopoint.companyStreet}, {ecopoint.companyNumber}{ecopoint.companyComplement && `/${ecopoint.companyComplement}`}, {ecopoint.companyDistrict}
                                            </div>
                                            <button 
                                                className={s.location_dot_button}
                                                onClick={() => openGoogleMaps(ecopoint.companyStreet, ecopoint.companyNumber, ecopoint.companyDistrict, ecopoint.companyCity)}>
                                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </section>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onRequestClose={closeModal}
                contentLabel="Horários de Funcionamento"
                className={s.modal}
                overlayClassName={s.modalOverlay}
            >
                <h2 className={s.modal_title}>Horários de funcionamento</h2>

                <FontAwesomeIcon
                    icon={faTimes}
                    className={s.modal_close}
                    onClick={closeModal}
                />

                {currentSchedules.map((schedule, index) => (
                    <div className={s.days} key={index}>
                        <label className={s.day}>
                            {[
                                'domingo', 
                                'segunda-feira', 
                                'terça-feira', 
                                'quarta-feira', 
                                'quinta-feira', 
                                'sexta-feira', 
                                'sábado'
                            ][schedule.weekDay]} - {schedule.startTime1} - {schedule.endTime1} {schedule.startTime2 && schedule.endTime2 && (
                                <>
                                    | {schedule.startTime2} - {schedule.endTime2}
                                </>
                            )}
                        </label>
                    </div>
                ))}

            </Modal>
        </div>
    );
};

export default EcopointsList;
