import { useMemo } from 'react';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { XCircleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

// ─── Utils (ported from old code) ─────────────────────────────────────────────

const checkKey = (answer, userAnswers) => {
  for (const ans of userAnswers) {
    if (ans.key === answer.key) {
      if (!ans.value || !answer.value) return false;
      const accepted = answer.value.split(';').map((v) => v.toLowerCase().trim());
      return accepted.includes(ans.value.toLowerCase().trim());
    }
  }
  return false;
};

const checkKeys = (answer, userAnswers) => {
  for (const ans of userAnswers) {
    if (ans.keys === answer.keys) {
      if (!Array.isArray(ans.values) || !Array.isArray(answer.values)) return 0;
      const correctSet = new Set(answer.values.map((v) => v.toLowerCase().trim()));
      return ans.values.filter((v) => correctSet.has(v.toLowerCase().trim())).length;
    }
  }
  return 0;
};

const countCorrectAnswers = (answers, userAnswers) => {
  let count = 0;
  for (const answer of answers) {
    if (answer.key) {
      if (checkKey(answer, userAnswers)) count++;
    } else if (answer.keys) {
      count += checkKeys(answer, userAnswers);
    }
  }
  return count;
};

const getValue = (answer, userAnswers) => {
  for (const ans of userAnswers) {
    if (answer.key && ans.key === answer.key) return ans.value ?? '-';
    if (answer.keys && ans.keys === answer.keys)
      return Array.isArray(ans.values) ? ans.values.join(', ') : ans.values ?? '-';
  }
  return '-';
};

const isCorrect = (answer, userAnswers) => {
  if (answer.key) return checkKey(answer, userAnswers);
  if (answer.keys) return checkKeys(answer, userAnswers) > 0;
  return false;
};

const correctValueOf = (answer) =>
  answer.value
    ? answer.value
    : Array.isArray(answer.values)
    ? answer.values.join(', ')
    : '-';

const questionMinKey = (answer) => {
  if (answer.key != null) return Number(answer.key);
  if (answer.keys) return Number(String(answer.keys).split(/[-–]/)[0]);
  return Number.MAX_SAFE_INTEGER;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusIcon = ({ correct }) => {
  if (correct === true)
    return <CheckCircleSolidIcon className="w-5 h-5 text-green-500" />;
  if (correct === false)
    return <XCircleIcon className="w-5 h-5 text-red-500" />;
  return <MinusCircleIcon className="w-5 h-5 text-slate-300" />;
};

const SectionRow = ({ label, color }) => (
  <tr>
    <td
      colSpan={4}
      className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${color}`}
    >
      {label}
    </td>
  </tr>
);

// ─── Main component ───────────────────────────────────────────────────────────

// sections: [{ label, range: [min, max], color }]
const AnswerTable = ({ answers = [], userAnswers = [], sections = [], accentColor = 'indigo' }) => {
  const correctCount = useMemo(
    () => countCorrectAnswers(answers, userAnswers),
    [answers, userAnswers]
  );

  const tableData = useMemo(() => {
    return [...answers]
      .sort((a, b) => questionMinKey(a) - questionMinKey(b))
      .map((answer) => {
        const minKey = questionMinKey(answer);
        const qNumber = answer.key != null ? String(answer.key) : String(answer.keys);
        const correct = isCorrect(answer, userAnswers);
        const userValue = getValue(answer, userAnswers);
        const correctValue = correctValueOf(answer);

        const section = sections.find(
          (s) => minKey >= s.range[0] && minKey <= s.range[1]
        );

        return { qNumber, correct, userValue, correctValue, section, minKey };
      });
  }, [answers, userAnswers, sections]);

  const wrongCount = tableData.filter((r) => !r.correct).length;

  // Build rows with section headers inserted
  const rows = [];
  let lastSection = null;

  tableData.forEach((row, idx) => {
    if (row.section && row.section.label !== lastSection) {
      lastSection = row.section.label;
      rows.push(
        <SectionRow
          key={`section-${row.section.label}`}
          label={row.section.label}
          color={row.section.color}
        />
      );
    }

    rows.push(
      <tr
        key={idx}
        className={`border-b border-slate-100 transition-colors ${
          row.correct
            ? 'bg-green-50 hover:bg-green-100'
            : 'bg-red-50 hover:bg-red-100'
        }`}
      >
        {/* Q# */}
        <td className="px-3 py-2.5 w-14 whitespace-nowrap">
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-white bg-${accentColor}-600`}
          >
            {row.qNumber}
          </span>
        </td>

        {/* Correct Answer */}
        <td className="px-3 py-2.5 text-sm text-slate-800">
          {row.correctValue}
        </td>

        {/* User Answer */}
        <td className="px-3 py-2.5 text-sm">
          <span className={row.correct ? 'text-green-800 font-medium' : 'text-red-800 font-medium'}>
            {row.userValue}
          </span>
        </td>

        {/* Status */}
        <td className="px-3 py-2.5 w-10">
          <StatusIcon correct={row.correct} />
        </td>
      </tr>
    );
  });

  return (
    <div>
      {/* Score summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <p className={`text-3xl font-bold text-${accentColor}-600`}>{correctCount}</p>
          <p className="text-xs text-slate-500 mt-1">Correct</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-red-500">{wrongCount}</p>
          <p className="text-xs text-slate-500 mt-1">Wrong</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-slate-700">{correctCount} / 40</p>
          <p className="text-xs text-slate-500 mt-1">Total Score</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`bg-${accentColor}-600`}>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-14">
                  Q#
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Correct Answer
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Your Answer
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-10">
                  ✓/✗
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Total: {answers.length} questions</span>
          <span className={`text-sm font-semibold text-${accentColor}-600`}>
            {correctCount} / 40 correct
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnswerTable;
