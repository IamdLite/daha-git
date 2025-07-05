import React from 'react';
import ChangeThemes from '../components/ChangesThemes';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isAuthenticated } from '../App';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState<string>('');
  const [code, setCode] = React.useState<string>('');
  const [isCodeSent, setIsCodeSent] = React.useState<boolean>(false);
  const [rememberMe, setRememberMe] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Validation state
  const [usernameError, setUsernameError] = React.useState<string>('');
  const [codeError, setCodeError] = React.useState<string>('');

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  // Validate Telegram username (starts with @, followed by 5+ alphanumeric chars)
  const validateUsername = (username: string): boolean => {
    const re = /^@[A-Za-z0-9_]{5,}$/;
    return re.test(username);
  };

  const validateCode = (code: string): boolean => {
    return code.length === 6 && /^\d+$/.test(code);
  };

  // Real-time validation handlers
  const handleUsernameChange = (value: string) => {
    setUsername(value);

    if (!value) {
      setUsernameError('Username is required');
    } else if (!validateUsername(value)) {
      setUsernameError('Please enter a valid Telegram username (e.g., @username)');
    } else {
      setUsernameError('');
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);

    if (!value) {
      setCodeError('Code is required');
    } else if (!validateCode(value)) {
      setCodeError('Code must be 6 digits');
    } else {
      setCodeError('');
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      setUsernameError('Username is required');
      return;
    } else if (!validateUsername(username)) {
      setUsernameError('Please enter a valid Telegram username (e.g., @username)');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate sending code to Telegram
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Code sent to your Telegram account!');
      setIsCodeSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setCodeError('Code is required');
      return;
    } else if (!validateCode(code)) {
      setCodeError('Code must be 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate code validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('isAuthenticated', 'true');
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('username', username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
      }

      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem('rememberMe') === 'true') {
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
        setRememberMe(true);
        if (!validateUsername(savedUsername)) {
          setUsernameError('Please enter a valid Telegram username (e.g., @username)');
        } else {
          setUsernameError('');
        }
      }
    }
  }, []);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full min-h-screen flex justify-center items-center bg-base-200 relative">
        <div className="absolute top-5 right-5 z-[99]">
          <ChangeThemes />
        </div>
        <div className="w-full h-screen xl:h-auto xl:w-[30%] 2xl:w-[25%] 3xl:w-[20%] bg-base-100 rounded-lg shadow-md flex flex-col items-center p-5 pb-7 gap-8 pt-20 xl:pt-7">
          <div className="flex items-center gap-1 xl:gap-2">
            <span className="text-[18px] leading-[1.2] sm:text-lg xl:text-3xl 2xl:text-3xl font-semibold text-base-content dark:text-neutral-200">
              DAHA Admin Portal
            </span>
          </div>
          <span className="xl:text-xl font-semibold">Hello, 👋 Welcome Back!</span>

          <form onSubmit={isCodeSent ? handleValidateCode : handleSendCode} className="w-full flex flex-col items-stretch gap-3">
            <label className="input input-bordered min-w-full flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M2.277.298a.75.75 0 0 0-.54.362l-1.435 2.5a.75.75 0 0 0 .642 1.124l2.09.313-.634 4.372H1.25a.75.75 0 0 0 0 1.5h2.5v3.25a.75.75 0 0 0 1.5 0V10.5h2.5v3.25a.75.75 0 0 0 1.5 0V10.5h1.25a.75.75 0 0 0 0-1.5H9.61l-.634-4.372 2.09-.313a.75.75 0 0 0 .642-1.124l-1.435-2.5a.75.75 0 0 0-.54-.362L7.723.026a.75.75 0 0 0-.446 0L2.277.298Zm3.973 7.462 1.5-10-3.97.572 1.47 10.428h1Z" />
                </svg>
                <input
                  type="text"
                  className={`grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 ${
                    usernameError ? 'input-error' : ''
                  }`}
                  placeholder="Telegram Username (e.g., @username)"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  disabled={isCodeSent}
                  required
                />
              </div>
              {usernameError && <span className="text-error text-xs ml-6">{usernameError}</span>}
            </label>

            {isCodeSent && (
              <label className="input input-bordered flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    className={`grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 ${
                      codeError ? 'input-error' : ''
                    }`}
                    placeholder="Verification Code"
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    required
                  />
                </div>
                {codeError && <span className="text-error text-xs ml-6">{codeError}</span>}
              </label>
            )}

            <div className="flex items-center justify-between">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox w-4 h-4 rounded-md checkbox-primary"
                  />
                  <span className="label-text text-xs">Remember me</span>
                </label>
              </div>
              {isCodeSent && (
                <button
                  onClick={() => setIsCodeSent(false)}
                  className="link link-primary font-semibold text-xs no-underline"
                >
                  Resend Code
                </button>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-block btn-primary ${isLoading ? 'btn-disabled' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : isCodeSent ? (
                'Verify Code'
              ) : (
                'Send Code'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;