def measure_execution_time(func):
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        execution_time = time.time() - start_time
        logging.info(f"{func.__name__} took {execution_time:.2f} seconds")
        return result
    return wrapper

