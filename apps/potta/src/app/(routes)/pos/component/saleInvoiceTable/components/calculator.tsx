import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [memory, setMemory] = useState<number>(0);

  const appendToInput = (value: string) => {
    if (input) {
      if (
        value === '.' && input.split(/[\+\-\*\/]/).pop()?.includes('.')
      ) {
        return;
      }
    }
    setInput((prev) => prev + value);
  };

  const clearInput = () => {
    setInput('');
  };

  const calculateResult = () => {
    try {
      const result = eval(input.replace(/X/g, '*')); // Replace 'X' back to '*' for evaluation
      setInput(result.toString().replace(/\*/g, 'X')); // Show result with 'X'
    } catch (error) {
      setInput('Error');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(input)
      .then(() => {
        alert('Copied to clipboard: ' + input);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleMemoryPlus = () => {
    setMemory(memory + parseFloat(input));
  };

  // Convert the input to display 'X' instead of '*'
  const displayInput = input.replace(/\*/g, 'X');

  return (
    <div className="flex flex-col text-2xl items-center justify-center h-full bg-gray-100">

      <div className="bg-white p-6 w-full h-full">
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={displayInput}
            readOnly
            className="flex-1 h-24 text-right text-3xl  p-2"
          />

          <button
            onClick={copyToClipboard}
            className="ml-2 bg-gray-400 text-white h-24 rounded-full hover:bg-gray-600 w-24"
          >
            <i className="ri-file-copy-line"></i>
          </button>
        </div>

        {/* Operator Buttons Row */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <button
            onClick={handleMemoryClear}
            className="bg-green-800 text-white h-24  hover:bg-green-900 px-2 "
          >
            MC
          </button>
          <button
            onClick={handleMemoryPlus}
            className="bg-green-800 text-white h-24  hover:bg-green-900 px-2 "
          >
            M+
          </button>
          <button
            onClick={() => appendToInput('/')}
            className="h-24  hover:bg-green-900 bg-green-800 text-white"
          >
            /
          </button>
          <button
            onClick={() => appendToInput('X')}
            className="h-24  hover:bg-green-900 bg-green-800 text-white"
          >
            X
          </button>
        </div>

        {/* Number and Other Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => appendToInput('7')}
            className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
          >
            7
          </button>
          <button
            onClick={() => appendToInput('8')}
            className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
          >
            8
          </button>
          <button
            onClick={() => appendToInput('9')}
            className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
          >
            9
          </button>
          <button
            onClick={() => appendToInput('-')}
            className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
          >
            -
          </button>
          <button
            onClick={() => appendToInput('4')}
            className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
          >
            4
          </button>
          <button
            onClick={() => appendToInput('5')}
            className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
          >
            5
          </button>
          <button
            onClick={() => appendToInput('6')}
            className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
          >
            6
          </button>
          <button
            onClick={() => appendToInput('+')}
            className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
          >
            +
          </button>
          <div className="grid grid-cols-3 gap-2 col-span-3">
            <button
              onClick={() => appendToInput('1')}
              className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
            >
              1
            </button>
            <button
              onClick={() => appendToInput('2')}
              className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
            >
              2
            </button>
            <button
              onClick={() => appendToInput('3')}
              className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
            >
              3
            </button>

            <button
              onClick={() => appendToInput('0')}
              className="h-24  hover:bg-gray-300 bg-gray-100 text-black "
            >
              0
            </button>
            <button
              onClick={() => appendToInput('.')}
              className="h-24  hover:bg-gray-300 bg-gray-100 text-black"
            >
              .
            </button>
            <button
              onClick={clearInput}
              className=" hover:bg-slate-900 text-white h-24  bg-slate-950 px-2"
            >
              C
            </button>
          </div>
          <button
            onClick={calculateResult}
            className="bg-orange-500 text-white h-22  hover:bg-orange-600 col-span-1"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
