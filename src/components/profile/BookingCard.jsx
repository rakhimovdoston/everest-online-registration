import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ClockIcon,
  CreditCardIcon,
  CalendarIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";

const BookingCard = ({ registration, isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isPaid = registration.payment === "PAID";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = t("common.months", { returnObjects: true });
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " UZS";
  };

  const getStatusBadge = (status) => {
    const styles = {
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      WAITING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PROCESS: "bg-blue-100 text-blue-800 border-blue-200",
      SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    const labels = {
      COMPLETED: t("profile.status.completed"),
      WAITING: t("profile.status.waiting"),
      PROCESS: t("profile.status.process"),
      FAILED: t("profile.status.failed"),
      SCHEDULED: t("profile.status.scheduled"),
      CANCELLED: t("profile.status.cancelled"),
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          styles[status] || "bg-yellow-100 text-yellow-800 border-yellow-200"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const getTimeLabel = (time) => {
    const timeLabels = {
      morning: t("profile.time.morning"),
      afternoon: t("profile.time.afternoon"),
      evening: t("profile.time.evening"),
    };
    return timeLabels[time] || time;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Accordion Title — Booking Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-6 flex items-start justify-between cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {registration.mockPackages.name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {formatDate(registration.date)}
            </div>
            <div className="flex items-center gap-1">
              <CreditCardIcon className="w-4 h-4" />
              {registration.results[0]?.branchName || "EVEREST"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">
              {formatPrice(registration.mockPackages.price)}
            </p>
            {registration.payment === "PAID" ? (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-1">
                {t("profile.payment.paid")}
              </span>
            ) : registration.payment === "PENDING" ||
              registration.payment === "CREATED" ? (
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium mt-1">
                {t("profile.payment.pending")}
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium mt-1">
                {registration.payment}
              </span>
            )}
          </div>
          <ChevronDownIcon
            className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Accordion Content — All Sessions */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          {/* Payment Warning */}
          {!isPaid &&
            (registration.payment === "PENDING" ||
              registration.payment === "CREATED") && (
              <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    {t("profile.payment.warning")}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {t("profile.payment.warningExpiry")}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/test-registration/payment/${registration.id}`
                    );
                  }}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-medium transition-colors flex-shrink-0"
                >
                  {t("profile.payment.pay")}
                </button>
              </div>
            )}

          {/* Test Sessions */}
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-indigo-600" />
            {t("profile.testSessions")} ({registration.results.length})
          </h4>

          <div className="space-y-4">
            {registration.results.map((testSession, idx) => {
              const relatedSpeaking = registration.speakings.find(
                (speaking) =>
                  speaking.examResponses.some(
                    (exam) => exam.id === testSession.id
                  )
              );

              return (
                <div
                  key={testSession.id}
                  className={`rounded-xl border-2 p-5 transition-all ${
                    testSession.examStatus === "FAILED"
                      ? "bg-gradient-to-br from-red-50 to-white border-red-200"
                      : isPaid
                      ? "bg-gradient-to-br from-slate-50 to-white border-slate-200"
                      : "bg-slate-50 border-slate-200 opacity-50"
                  }`}
                >
                  {/* Session Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 rounded-lg px-3 py-1">
                        <span className="text-sm font-bold text-indigo-700">
                          {t("profile.session")} {idx + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {formatDate(testSession.testDate)}
                        </p>
                        <p className="text-xs text-slate-600">
                          {getTimeLabel(testSession.time)} •{" "}
                          {testSession.branchName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(testSession.examStatus)}
                      {testSession.examStatus === "COMPLETED" ? (
                        <CheckCircleSolidIcon className="w-6 h-6 text-green-600" />
                      ) : (
                        <ClockIcon className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>
                  </div>

                  {/* Scores */}
                  {testSession.examStatus === "COMPLETED" ? (
                    <>

                      <div className="grid grid-cols-5 gap-3">
                        {/* Listening */}
                        <Link
                          to={
                            isPaid
                              ? `/test-results/${testSession.id}/listening`
                              : "#"
                          }
                          onClick={
                            !isPaid
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                          className={`bg-white rounded-lg p-3 border border-slate-200 text-center transition-all group relative ${
                            isPaid
                              ? "hover:border-indigo-400 hover:shadow-lg cursor-pointer"
                              : "cursor-default"
                          }`}
                        >
                          {isPaid && (
                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-indigo-400 absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg
                              className="w-4 h-4 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                              />
                            </svg>
                            <p className="text-[10px] font-semibold text-slate-700">
                              Listening
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-indigo-600">
                            {testSession.listening || "-"}
                          </p>
                        </Link>

                        {/* Reading */}
                        <Link
                          to={
                            isPaid
                              ? `/test-results/${testSession.id}/reading`
                              : "#"
                          }
                          onClick={
                            !isPaid
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                          className={`bg-white rounded-lg p-3 border border-slate-200 text-center transition-all group relative ${
                            isPaid
                              ? "hover:border-indigo-400 hover:shadow-lg cursor-pointer"
                              : "cursor-default"
                          }`}
                        >
                          {isPaid && (
                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-indigo-400 absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg
                              className="w-4 h-4 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            <p className="text-[10px] font-semibold text-slate-700">
                              Reading
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-indigo-600">
                            {testSession.reading || "-"}
                          </p>
                        </Link>

                        {/* Writing */}
                        <Link
                          to={
                            isPaid
                              ? `/test-results/${testSession.id}/writing`
                              : "#"
                          }
                          onClick={
                            !isPaid
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                          className={`bg-white rounded-lg p-3 border border-slate-200 text-center transition-all group relative ${
                            isPaid
                              ? "hover:border-indigo-400 hover:shadow-lg cursor-pointer"
                              : "cursor-default"
                          }`}
                        >
                          {isPaid && (
                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-indigo-400 absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg
                              className="w-4 h-4 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            <p className="text-[10px] font-semibold text-slate-700">
                              Writing
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-indigo-600">
                            {testSession.writing || "-"}
                          </p>
                        </Link>

                        {/* Speaking */}
                        <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg
                              className="w-4 h-4 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                              />
                            </svg>
                            <p className="text-[10px] font-semibold text-slate-700">
                              Speaking
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-indigo-600">
                            {relatedSpeaking?.score ||
                              testSession.speaking ||
                              "-"}
                          </p>
                          {relatedSpeaking?.date && (
                            <p className="text-[9px] text-slate-500 mt-0.5">
                              {formatDate(relatedSpeaking.date)}
                            </p>
                          )}
                          {relatedSpeaking?.speakerName && (
                            <p className="text-[9px] text-slate-400">
                              {relatedSpeaking.speakerName}
                            </p>
                          )}
                        </div>

                        {/* Overall */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border-2 border-indigo-300 text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrophyIcon className="w-4 h-4 text-indigo-600" />
                            <p className="text-[10px] font-semibold text-slate-700">
                              Overall
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-indigo-600">
                            {(() => {
                              const roundBand = (score) => {
                                const rounded = Math.round(score * 100) / 100;
                                const floor = Math.floor(rounded);
                                const decimal = rounded - floor;
                                if (decimal < 0.25) return floor;
                                if (decimal < 0.75) return floor + 0.5;
                                return floor + 1.0;
                              };
                              const speakingScore =
                                relatedSpeaking?.score || testSession.speaking;
                              const scores = [
                                testSession.listening,
                                testSession.reading,
                                testSession.writing,
                                speakingScore,
                              ]
                                .map((s) => parseFloat(s))
                                .filter((n) => !isNaN(n));
                              if (scores.length === 0) return "-";
                              const avg =
                                scores.reduce((a, b) => a + b, 0) /
                                scores.length;
                              return roundBand(avg).toFixed(1);
                            })()}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-4 text-center">
                      {testSession.examStatus === "FAILED" ? (
                        <svg className="w-10 h-10 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : testSession.examStatus === "PROCESS" ? (
                        <svg className="w-10 h-10 text-blue-400 mx-auto mb-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <ClockIcon className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                      )}
                      <p className={`text-sm font-medium ${
                        testSession.examStatus === "FAILED"
                          ? "text-red-600"
                          : testSession.examStatus === "PROCESS"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}>
                        {testSession.examStatus === "FAILED"
                          ? t("profile.status.failed")
                          : testSession.examStatus === "PROCESS"
                          ? t("profile.status.process")
                          : t("profile.status.waiting")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Speaking Sessions */}
          {registration.speakings && registration.speakings.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-slate-900 mt-6 mb-3 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-600" />
                {t("profile.speakingSessions")} ({registration.speakings.length})
              </h4>

              <div className="space-y-3">
                {registration.speakings.map((speaking, idx) => (
                  <div
                    key={speaking.id || idx}
                    className={`rounded-xl border-2 p-4 flex items-center justify-between ${
                      isPaid
                        ? "bg-gradient-to-br from-green-50 to-white border-green-200"
                        : "bg-slate-50 border-slate-200 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 rounded-lg px-3 py-1">
                        <span className="text-sm font-bold text-green-700">
                          {t("profile.session")} {idx + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {speaking.date ? formatDate(speaking.date) : "—"}
                        </p>
                        <p className="text-xs text-slate-600">
                          {speaking.speakerName || "—"} • {speaking.speakingTime || speaking.time || ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {speaking.score ? (
                        <>
                          <span className="text-lg font-bold text-green-600">{speaking.score}</span>
                          <CheckCircleSolidIcon className="w-5 h-5 text-green-600" />
                        </>
                      ) : (
                        <>
                          <span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
                            {t("profile.speakingPending")}
                          </span>
                          <ClockIcon className="w-5 h-5 text-yellow-600" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
